import { useEffect, useRef, useState } from 'react';
import { type LogEntry, type ParsedLogs } from '../utils/logParser';
import './LogVisualizer.css';

interface LogVisualizerProps {
    logs: ParsedLogs;
}

export function LogVisualizer({ logs }: LogVisualizerProps) {
    const { entries, loggerNames, timeRange } = logs;

    // Calculate total duration in milliseconds
    const duration = timeRange.start && timeRange.end
        ? timeRange.end.getTime() - timeRange.start.getTime()
        : 0;

    // Calculate a smart default time scale based on duration
    // Aim for a reasonable viewport height (e.g., 2000-5000px for most cases)
    const calculateDefaultScale = () => {
        if (duration === 0) return 50; // Default for no duration
        const durationSeconds = duration / 1000;

        // Target height: 2000-5000px depending on duration
        // For very short durations (< 1s), use more pixels per second
        // For longer durations, use fewer pixels per second
        if (durationSeconds < 1) {
            return 200; // 200px per second for sub-second logs
        } else if (durationSeconds < 10) {
            return 100; // 100px per second for < 10 seconds
        } else if (durationSeconds < 60) {
            return 50; // 50px per second for < 1 minute
        } else {
            return 20; // 20px per second for longer durations
        }
    };

    const [selectedLoggers, setSelectedLoggers] = useState<Set<string>>(
        new Set(logs.loggerNames)
    );
    const [timeScale, setTimeScale] = useState(calculateDefaultScale());
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    // Calculate total height needed
    const totalHeight = duration > 0
        ? Math.max(duration / 1000 * timeScale, 100)
        : Math.max(entries.length * 40, 100); // Fallback: 40px per entry if no timestamps

    // Filter entries by selected loggers (case-insensitive)
    // Note: Session separators should appear in all logger columns, so we handle them specially
    const selectedLoggersLower = new Set(Array.from(selectedLoggers).map(name => name.toLowerCase()));
    const filteredEntries = entries.filter(e => {
        // Always include session separators
        if (e.isSeparator) return true;
        // Include entries from selected loggers (case-insensitive match)
        return selectedLoggersLower.has(e.loggerName.toLowerCase());
    });

    // Group entries by session first
    interface Session {
        id: number;
        startTime: Date | null;
        entries: LogEntry[];
    }

    const sessions: Session[] = [];
    let currentSession: Session = { id: 0, startTime: null, entries: [] };
    let sessionId = 0;

    filteredEntries.forEach(entry => {
        if (entry.isSeparator) {
            // Start a new session
            if (currentSession.entries.length > 0) {
                sessions.push(currentSession);
            }
            sessionId++;
            currentSession = {
                id: sessionId,
                startTime: entry.timestamp,
                entries: [entry] // Include separator in session
            };
        } else {
            currentSession.entries.push(entry);
            // Update session start time if this is the first entry
            if (!currentSession.startTime && entry.timestamp) {
                currentSession.startTime = entry.timestamp;
            }
        }
    });

    // Add the last session
    if (currentSession.entries.length > 0) {
        sessions.push(currentSession);
    }

    // If no sessions found (no separators), create one session with all entries
    if (sessions.length === 0) {
        sessions.push({
            id: 0,
            startTime: timeRange.start,
            entries: filteredEntries
        });
    }

    // Group entries by logger within each session
    // Create a normalized map: lowercase logger name -> actual logger name from selectedLoggers
    const loggerNameMap = new Map<string, string>();
    selectedLoggers.forEach(selectedName => {
        loggerNameMap.set(selectedName.toLowerCase(), selectedName);
    });

    // Also map actual logger names from entries to their normalized selected name
    filteredEntries.forEach(entry => {
        if (!entry.isSeparator) {
            const normalized = entry.loggerName.toLowerCase();
            if (!loggerNameMap.has(normalized)) {
                // Use the actual logger name from the entry if not in selected
                loggerNameMap.set(normalized, entry.loggerName);
            }
        }
    });

    // Initialize all selected loggers to ensure they all show up
    const sessionsByLogger = new Map<string, Map<number, LogEntry[]>>();

    // Initialize all selected loggers with empty session maps
    selectedLoggers.forEach(loggerName => {
        if (!sessionsByLogger.has(loggerName)) {
            sessionsByLogger.set(loggerName, new Map());
        }
    });

    // Now populate with actual entries
    sessions.forEach(session => {
        session.entries.forEach(entry => {
            // Session separators should appear in all selected logger columns
            if (entry.isSeparator) {
                selectedLoggers.forEach(loggerName => {
                    if (!sessionsByLogger.has(loggerName)) {
                        sessionsByLogger.set(loggerName, new Map());
                    }
                    const loggerSessions = sessionsByLogger.get(loggerName)!;
                    if (!loggerSessions.has(session.id)) {
                        loggerSessions.set(session.id, []);
                    }
                    // Add separator to this logger's session
                    loggerSessions.get(session.id)!.push(entry);
                });
            } else {
                // Regular entries go to their specific logger
                // Find matching logger name (case-insensitive)
                const normalizedEntryName = entry.loggerName.toLowerCase();
                const targetLogger = loggerNameMap.get(normalizedEntryName);

                if (!targetLogger) {
                    // This shouldn't happen since we filtered, but just in case
                    console.warn('Entry logger name not found in map:', entry.loggerName);
                    return;
                }

                // Check if this logger is actually selected (case-insensitive)
                const isSelected = Array.from(selectedLoggers).some(
                    name => name.toLowerCase() === normalizedEntryName
                );

                if (!isSelected) {
                    return;
                }

                if (!sessionsByLogger.has(targetLogger)) {
                    sessionsByLogger.set(targetLogger, new Map());
                }
                const loggerSessions = sessionsByLogger.get(targetLogger)!;
                if (!loggerSessions.has(session.id)) {
                    loggerSessions.set(session.id, []);
                }
                loggerSessions.get(session.id)!.push(entry);
            }
        });
    });

    // Debug: Log entry distribution (only if there are issues)
    const apiLoggerSessions = Array.from(sessionsByLogger.entries()).filter(([loggerName]) => loggerName.toLowerCase().includes('api'));
    if (apiLoggerSessions.length > 0) {
        const apiTotalEntries = apiLoggerSessions.reduce((sum, [, sessions]) => {
            return sum + Array.from(sessions.values()).reduce((s, entries) => s + entries.length, 0);
        }, 0);
        console.log(`API logger: ${apiLoggerSessions[0][0]}, Total entries: ${apiTotalEntries}`);
    }

    // Calculate positions for all entries within a session, handling overlaps
    const calculatePositions = (loggerEntries: LogEntry[]): Map<LogEntry, { top: number; height: number; left?: number }> => {
        const positions = new Map<LogEntry, { top: number; height: number; left?: number }>();
        const positionMap = new Map<number, number>(); // Track how many entries at each time position

        loggerEntries.forEach(entry => {
            let top = 0;
            let height = 30;

            if (!timeRange.start || !entry.timestamp) {
                // Place entries without timestamps at the end
                top = totalHeight + 10;
            } else {
                const offset = entry.timestamp.getTime() - timeRange.start.getTime();
                top = (offset / 1000) * timeScale;
            }

            // Calculate height based on message length
            const messageLines = entry.message.split('\n').length;
            height = Math.max(30, messageLines * 20 + 10);

            // Handle overlapping entries by stacking them
            const timeKey = Math.floor(top / 10) * 10; // Round to nearest 10px for grouping
            const existingCount = positionMap.get(timeKey) || 0;
            positionMap.set(timeKey, existingCount + 1);

            // If there are multiple entries at the same time, offset them slightly
            if (existingCount > 0) {
                top += existingCount * 5; // Small offset for visual separation
            }

            positions.set(entry, { top, height });
        });

        return positions;
    };

    // Calculate session separator positions
    const getSessionSeparatorPosition = (session: Session): number => {
        if (!timeRange.start || !session.startTime) {
            return 0;
        }
        const offset = session.startTime.getTime() - timeRange.start.getTime();
        return (offset / 1000) * timeScale;
    };

    // Format timestamp for display
    const formatTime = (date: Date | null): string => {
        if (!date) return 'No timestamp';
        const timeStr = date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        // Add milliseconds manually
        const ms = date.getMilliseconds().toString().padStart(3, '0');
        return `${timeStr}.${ms}`;
    };

    // Handle scroll synchronization
    useEffect(() => {
        const container = containerRef.current;
        const timeline = timelineRef.current;
        if (!container || !timeline) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            timeline.scrollTop = scrollTop;
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // Generate timeline markers
    const generateTimelineMarkers = () => {
        if (!timeRange.start || !timeRange.end) return [];

        const markers: Array<{ time: Date; position: number }> = [];
        const interval = Math.max(1000, duration / 20); // At least 1 second, or divide by 20
        const startTime = timeRange.start.getTime();

        for (let t = startTime; t <= timeRange.end.getTime(); t += interval) {
            const position = ((t - startTime) / 1000) * timeScale;
            markers.push({ time: new Date(t), position });
        }

        return markers;
    };

    const timelineMarkers = generateTimelineMarkers();

    return (
        <div className="log-visualizer">
            <div className="visualizer-controls">
                <div className="logger-selector">
                    <h3>Loggers</h3>
                    {loggerNames.map(name => (
                        <label key={name} className="logger-checkbox">
                            <input
                                type="checkbox"
                                checked={selectedLoggers.has(name)}
                                onChange={(e) => {
                                    const newSelected = new Set(selectedLoggers);
                                    if (e.target.checked) {
                                        newSelected.add(name);
                                    } else {
                                        newSelected.delete(name);
                                    }
                                    setSelectedLoggers(newSelected);
                                }}
                            />
                            <span>{name}</span>
                        </label>
                    ))}
                </div>

                <div className="time-controls">
                    <label>
                        Time Scale (px/sec):
                        <input
                            type="range"
                            min="10"
                            max="2000"
                            step="10"
                            value={timeScale}
                            onChange={(e) => setTimeScale(Number(e.target.value))}
                        />
                        <span>{timeScale}</span>
                    </label>
                    <button
                        onClick={() => setTimeScale(calculateDefaultScale())}
                        className="reset-scale-button"
                    >
                        Auto Scale
                    </button>
                </div>

                <div className="time-range">
                    <div>Start: {timeRange.start ? formatTime(timeRange.start) : 'N/A'}</div>
                    <div>End: {timeRange.end ? formatTime(timeRange.end) : 'N/A'}</div>
                    <div>Duration: {duration > 0 ? (duration / 1000).toFixed(2) + 's' : 'N/A'}</div>
                    <div>Total Entries: {entries.length}</div>
                    <div>Filtered Entries: {filteredEntries.length}</div>
                    <div>Sessions: {sessions.length}</div>
                    <div>Entries with Timestamps: {entries.filter(e => e.timestamp).length}</div>
                    <div>Rendered Entries: {
                        Array.from(sessionsByLogger.values()).reduce((sum, sessions) => {
                            return sum + Array.from(sessions.values()).reduce((s, entries) => s + entries.length, 0);
                        }, 0)
                    }</div>
                    <div>Logger Names: {loggerNames.join(', ')}</div>
                    <div>Selected Loggers: {Array.from(selectedLoggers).join(', ')}</div>
                </div>
            </div>

            <div className="visualizer-main">
                <div className="timeline-header" ref={timelineRef}>
                    <div className="timeline-marker-container" style={{ height: totalHeight }}>
                        {timelineMarkers.map((marker, i) => (
                            <div
                                key={i}
                                className="timeline-marker"
                                style={{ top: marker.position }}
                            >
                                <div className="timeline-marker-line" />
                                <div className="timeline-marker-label">
                                    {formatTime(marker.time)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="columns-container" ref={containerRef}>
                    <div className="columns-wrapper" style={{ height: totalHeight }}>
                        {/* Render session separators across all columns */}
                        {sessions.map((session, sessionIndex) => {
                            if (sessionIndex === 0) return null; // Skip first session separator
                            const separatorTop = getSessionSeparatorPosition(session);
                            return (
                                <div
                                    key={`session-separator-${session.id}`}
                                    className="session-separator-line"
                                    style={{
                                        top: `${separatorTop}px`,
                                        left: 0,
                                        right: 0,
                                    }}
                                />
                            );
                        })}

                        {/* Render logs grouped by logger and session */}
                        {Array.from(sessionsByLogger.entries())
                            .filter(([loggerName]) => {
                                // Case-insensitive check
                                return Array.from(selectedLoggers).some(
                                    selected => selected.toLowerCase() === loggerName.toLowerCase()
                                );
                            })
                            .map(([loggerName, loggerSessions]) => {
                                // Get all entries for this logger across all sessions for debugging
                                const allLoggerEntries: LogEntry[] = [];
                                loggerSessions.forEach((entries) => {
                                    allLoggerEntries.push(...entries);
                                });

                                // Find the actual logger name from selectedLoggers (for case matching)
                                const actualLoggerName = Array.from(selectedLoggers).find(
                                    name => name.toLowerCase() === loggerName.toLowerCase()
                                ) || loggerName;

                                return (
                                    <div key={actualLoggerName} className="log-column">
                                        <div className="log-column-header">
                                            {actualLoggerName}
                                            <span className="entry-count">({allLoggerEntries.length})</span>
                                        </div>
                                        <div className="log-column-content">
                                            {Array.from(loggerSessions.entries())
                                                .sort(([a], [b]) => a - b) // Sort sessions by ID
                                                .map(([sessionId, loggerEntries]) => {
                                                    if (loggerEntries.length === 0) {
                                                        return null;
                                                    }

                                                    const positions = calculatePositions(loggerEntries);

                                                    return (
                                                        <div key={`${loggerName}-session-${sessionId}`} className="session-group">
                                                            {/* Log entries in this session */}
                                                            {loggerEntries.map((entry, index) => {
                                                                const position = positions.get(entry);
                                                                if (!position) {
                                                                    console.warn('Missing position for entry:', entry);
                                                                    return null;
                                                                }

                                                                const hasTimestamp = entry.timestamp !== null;

                                                                return (
                                                                    <div
                                                                        key={`${entry.loggerName}-${sessionId}-${index}-${entry.timestamp?.getTime() || index}`}
                                                                        className={`log-entry ${entry.isSeparator ? 'separator' : ''} ${!hasTimestamp ? 'no-timestamp' : ''}`}
                                                                        style={{
                                                                            top: `${position.top}px`,
                                                                            minHeight: `${position.height}px`,
                                                                            position: 'absolute',
                                                                            left: '5px',
                                                                            right: '5px',
                                                                        }}
                                                                        title={`${formatTime(entry.timestamp)} - ${entry.message}`}
                                                                    >
                                                                        {hasTimestamp && (
                                                                            <div className="log-entry-time">
                                                                                {formatTime(entry.timestamp)}
                                                                            </div>
                                                                        )}
                                                                        <div className="log-entry-message">{entry.message}</div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}
