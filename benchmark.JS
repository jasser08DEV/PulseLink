import http from "k6/http";
import { check } from "k6";
import encoding from "k6/encoding";
import exec from "k6/execution";
import { Counter, Trend } from "k6/metrics";

const baseUrl = (__ENV.BASE_URL || "http://localhost:8080").replace(/\/$/, "");
const targetRps = Number(__ENV.RPS || 5);
const durationSeconds = Number(__ENV.DURATION_SECONDS || 180);
const patientId = __ENV.PATIENT_ID || "Pd7bc0196";
const allocatedVUs = Number(__ENV.VUS || 100);
for (const [name, value] of Object.entries({
  RPS: targetRps,
  DURATION_SECONDS: durationSeconds,
  VUS: allocatedVUs,
})) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }
}

const recordUrl = `${baseUrl}/api/v1/patient-record/${encodeURIComponent(patientId)}/full`;
const successfulLatency = new Trend("successful_record_duration", true);
const unauthorized = new Counter("record_401");
const forbidden = new Counter("record_403");
const notFound = new Counter("record_404");
const serverErrors = new Counter("record_5xx");
const transportErrors = new Counter("record_transport_errors");
const unexpectedStatus = new Counter("record_non_200");

export const options = {
  scenarios: {
    pulselink_benchmark: {
      executor: "constant-arrival-rate",
      rate: targetRps,
      timeUnit: "1s",
      duration: `${durationSeconds}s`,
      preAllocatedVUs: allocatedVUs,
      maxVUs: allocatedVUs,
      gracefulStop: "30s",
    },
  },
  thresholds: {
    "http_req_failed{endpoint:patient_record}": ["rate==0"],
    "checks{endpoint:patient_record}": ["rate==1"],
    dropped_iterations: ["count==0"],
  },
};

function jsonOrNull(response) {
  try {
    return response.json();
  } catch (_) {
    return null;
  }
}

function validRecord(response, body) {
  return (
    response.status === 200 &&
    body !== null &&
    body.patientProfile !== null &&
    typeof body.patientProfile === "object" &&
    body.patientProfile.id === patientId &&
    body.patientProfile.role === "PATIENT" &&
    Array.isArray(body.medications) &&
    Array.isArray(body.procedures) &&
    Array.isArray(body.appointments)
  );
}

function requestParams(token, endpoint) {
  return {
    headers: { Authorization: `Bearer ${token}` },
    tags: { endpoint, name: "GET /api/v1/patient-record/:id/full" },
    redirects: 0,
    timeout: "10s",
  };
}

export function setup() {
  let token;
  if (__ENV.EMAIL || __ENV.PASSWORD) {
    if (!__ENV.EMAIL || !__ENV.PASSWORD) {
      throw new Error("Set both EMAIL and PASSWORD for automatic login.");
    }
    const login = http.post(
      `${baseUrl}/api/v1/auth/login`,
      JSON.stringify({ email: __ENV.EMAIL.trim(), password: __ENV.PASSWORD }),
      {
        headers: { "Content-Type": "application/json" },
        tags: { endpoint: "login", name: "POST /api/v1/auth/login" },
        redirects: 0,
        timeout: "10s",
      },
    );
    const body = jsonOrNull(login);
    if (login.status !== 200 || !body || typeof body.token !== "string") {
      throw new Error(
        `Login failed (HTTP ${login.status}); verify credentials and backend logs.`,
      );
    }
    token = body.token;
  } else {
    token = __ENV.TOKEN;
  }
  if (typeof token !== "string" || !token.trim()) {
    throw new Error(
      "Set EMAIL and PASSWORD, or provide TOKEN without the Bearer prefix.",
    );
  }
  token = token.trim();
  let claims;
  try {
    if (token.split(".").length !== 3) throw new Error("Invalid JWT");
    claims = JSON.parse(encoding.b64decode(token.split(".")[1], "rawurl", "s"));
  } catch (_) {
    throw new Error(
      "Token is not a readable JWT. Supply only the token, without quotes or Bearer.",
    );
  }
  if (!claims || !Number.isFinite(claims.exp)) {
    throw new Error("JWT has no numeric expiration claim.");
  }
  const remainingSeconds = claims.exp - Date.now() / 1000;
  if (remainingSeconds <= durationSeconds + 60) {
    throw new Error(
      "JWT expires too soon. Obtain a fresh token with enough lifetime for the run plus 60 seconds.",
    );
  }
  const preflight = http.get(recordUrl, requestParams(token, "preflight"));
  if (!validRecord(preflight, jsonOrNull(preflight))) {
    throw new Error(
      `Patient preflight failed (HTTP ${preflight.status}). Check PATIENT_ID, authorization, and response shape.`,
    );
  }
  console.log(
    "Preflight passed; patient matches and token lifetime covers the test.",
  );
  return { token, expiresAt: claims.exp * 1000 };
}

export default function (data) {
  if (Date.now() >= data.expiresAt - 5000) {
    exec.test.abort(
      "Token is about to expire. This is an incomplete run; obtain a fresh token.",
    );
    return;
  }
  const response = http.get(
    recordUrl,
    requestParams(data.token, "patient_record"),
  );
  const status = response.status;
  unauthorized.add(status === 401 ? 1 : 0);
  forbidden.add(status === 403 ? 1 : 0);
  notFound.add(status === 404 ? 1 : 0);
  serverErrors.add(status >= 500 && status <= 599 ? 1 : 0);
  transportErrors.add(status === 0 ? 1 : 0);
  unexpectedStatus.add(status !== 200 ? 1 : 0);

  const body = jsonOrNull(response);
  const valid = validRecord(response, body);
  check(
    response,
    {
      "status is 200": (r) => r.status === 200,
      "response is the requested patient record": () => valid,
    },
    { endpoint: "patient_record" },
  );
  if (valid) successfulLatency.add(response.timings.duration);
  if (status === 401 || status === 403) {
    exec.test.abort(
      `Patient request returned HTTP ${status}. Authentication/authorization failed; this is an incomplete run.`,
    );
  }
}
