package com.patientlink.backend.diagnostics;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Supplier;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PreDestroy;

/** Temporary aggregate timings; does not log identifiers or query results. */
@Component
public class BenchmarkTimings {
    private static final Logger log = LoggerFactory.getLogger(BenchmarkTimings.class);
    private final boolean enabled;
    private final long intervalNanos;
    private final Object lock = new Object();
    private final Map<String, Stats> current = new LinkedHashMap<>();
    private long windowStarted;

    public BenchmarkTimings(
            @Value("${benchmark.timings.enabled:false}") boolean enabled,
            @Value("${benchmark.timings.interval-ms:30000}") long intervalMs) {
        if (intervalMs < 1000 || intervalMs > 3600000) {
            throw new IllegalArgumentException("Timing interval must be between 1000 and 3600000 ms");
        }
        this.enabled = enabled;
        this.intervalNanos = intervalMs * 1_000_000L;
    }

    public <T> T measure(String operation, Supplier<T> action) {
        if (!enabled) return action.get();
        long started = System.nanoTime();
        boolean succeeded = false;
        try {
            T result = action.get();
            succeeded = true;
            return result;
        } finally {
            record(operation, System.nanoTime() - started, !succeeded);
        }
    }

    private void record(String operation, long nanos, boolean failed) {
        Map<String, Stats> completed = null;
        long windowNanos = 0;
        synchronized (lock) {
            long now = System.nanoTime();
            if (current.isEmpty()) windowStarted = now;
            Stats stats = current.computeIfAbsent(operation, unused -> new Stats());
            stats.count++;
            stats.totalNanos += nanos;
            stats.maxNanos = Math.max(stats.maxNanos, nanos);
            if (failed) stats.failures++;
            windowNanos = now - windowStarted;
            if (windowNanos >= intervalNanos) {
                completed = new LinkedHashMap<>(current);
                current.clear();
            }
        }
        // Write outside the aggregation lock. No per-request log output.
        if (completed != null) writeSummary(completed, windowNanos);
    }

    @PreDestroy
    public void flush() {
        if (!enabled) return;
        Map<String, Stats> completed;
        long windowNanos;
        synchronized (lock) {
            if (current.isEmpty()) return;
            completed = new LinkedHashMap<>(current);
            current.clear();
            windowNanos = System.nanoTime() - windowStarted;
        }
        writeSummary(completed, windowNanos);
    }

    private void writeSummary(Map<String, Stats> completed, long windowNanos) {
        completed.forEach((operation, stats) -> log.info(
                "PERF windowMs={} operation={} count={} failures={} avgMs={} maxMs={}",
                windowNanos / 1_000_000L, operation, stats.count, stats.failures,
                roundedMillis(stats.totalNanos / stats.count), roundedMillis(stats.maxNanos)));
    }

    private static double roundedMillis(long nanos) {
        return Math.round(nanos / 10_000.0) / 100.0;
    }

    private static class Stats {
        long count;
        long failures;
        long totalNanos;
        long maxNanos;
    }
}
