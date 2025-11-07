import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { LogEntry, ParsedLogs } from '../utils/logParser';
import './SessionDetail.css';
import { SessionTimelineView } from './SessionTimelineView';

interface SessionDetailProps {
    logs: ParsedLogs;
}

export function SessionDetail({ logs }: SessionDetailProps) {
    const { sessionId } = useParams<{ sessionId: string }>();
    const sessionNum = sessionId ? parseInt(sessionId, 10) : 0;

    const [selectedLoggers, setSelectedLoggers] = useState<Set<string>>(
        new Set(logs.loggerNames)
    );
    const [expandedLoggers, setExpandedLoggers] = useState<Set<string>>(
        new Set(logs.loggerNames)
    );
    const [activeView, setActiveView] = useState<'list' | 'timeline'>('list');

    // Create case-insensitive matching helper
    const isLoggerSelected = (loggerName: string): boolean => {
        return Array.from(selectedLoggers).some(
            selected => selected.toLowerCase() === loggerName.toLowerCase()
        );
    };

    const sessionData = useMemo(() => {
        const sessions: Array<{ id: number; entries: LogEntry[]; startTime: Date | null }> = [];
        let currentSession: { id: number; entries: LogEntry[]; startTime: Date | null } | null = null;
        let sessionId = 0;

        logs.entries.forEach(entry => {
            if (entry.isSeparator) {
                if (currentSession) {
                    sessions.push(currentSession);
                }
                sessionId++;
                currentSession = {
                    id: sessionId,
                    entries: [entry],
                    startTime: entry.timestamp,
                };
            } else {
                if (!currentSession) {
                    sessionId++;
                    currentSession = {
                        id: sessionId,
                        entries: [],
                        startTime: entry.timestamp,
                    };
                }
                currentSession.entries.push(entry);
                if (!currentSession.startTime && entry.timestamp) {
                    currentSession.startTime = entry.timestamp;
                }
            }
        });

        if (currentSession) {
            sessions.push(currentSession);
        }

        return sessions.find(s => s.id === sessionNum) || null;
    }, [logs.entries, sessionNum]);

    const filteredEntries = useMemo(() => {
        if (!sessionData) return [];
        return sessionData.entries.filter(e => {
            if (e.isSeparator) return true;
            // Case-insensitive check
            return Array.from(selectedLoggers).some(
                selected => selected.toLowerCase() === e.loggerName.toLowerCase()
            );
        });
    }, [sessionData, selectedLoggers]);

    const entriesByLogger = useMemo(() => {
        const grouped = new Map<string, LogEntry[]>();
        // Create a map to normalize logger names (use the name from selectedLoggers if available)
        const loggerNameMap = new Map<string, string>();
        selectedLoggers.forEach(name => {
            loggerNameMap.set(name.toLowerCase(), name);
        });

        filteredEntries.forEach(entry => {
            if (!entry.isSeparator) {
                // Use the normalized logger name (from selectedLoggers) if available
                const normalized = entry.loggerName.toLowerCase();
                const displayName = loggerNameMap.get(normalized) || entry.loggerName;

                if (!grouped.has(displayName)) {
                    grouped.set(displayName, []);
                }
                grouped.get(displayName)!.push(entry);
            }
        });
        return grouped;
    }, [filteredEntries, selectedLoggers]);

    const formatTime = (date: Date | null): string => {
        if (!date) return 'No timestamp';
        const timeStr = date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        const ms = date.getMilliseconds().toString().padStart(3, '0');
        return `${timeStr}.${ms}`;
    };

    if (!sessionData) {
        return (
            <div className="session-detail">
                <div className="session-not-found">
                    <h2>Session not found</h2>
                    <Link to="/sessions" className="back-link">
                        ← Back to Sessions
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="session-detail">
            <div className="session-detail-header">
                <Link to="/sessions" className="back-link">
                    ← Back to Sessions
                </Link>
                <div className="session-title">
                    <h2>Session {sessionNum}</h2>
                    <span className="session-entry-count">
                        {sessionData.entries.filter(e => !e.isSeparator).length} entries
                    </span>
                </div>
            </div>

            <div className="view-tabs">
                <button
                    className={`tab-button ${activeView === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveView('list')}
                >
                    List View
                </button>
                <button
                    className={`tab-button ${activeView === 'timeline' ? 'active' : ''}`}
                    onClick={() => setActiveView('timeline')}
                >
                    Timeline View
                </button>
            </div>

            {activeView === 'list' ? (
                <>
                    <div className="session-controls">
                        <div className="logger-selector">
                            <h3>Loggers</h3>
                            <div className="logger-checkboxes">
                                {logs.loggerNames.map(name => {
                                    // Check if this logger has any entries in the current session
                                    const hasEntries = sessionData.entries.some(
                                        e => !e.isSeparator && e.loggerName.toLowerCase() === name.toLowerCase()
                                    );

                                    return (
                                        <label key={name} className="logger-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={isLoggerSelected(name)}
                                                onChange={(e) => {
                                                    const newSelected = new Set(selectedLoggers);
                                                    if (e.target.checked) {
                                                        newSelected.add(name);
                                                    } else {
                                                        // Remove case-insensitive match
                                                        const toRemove = Array.from(newSelected).find(
                                                            n => n.toLowerCase() === name.toLowerCase()
                                                        );
                                                        if (toRemove) {
                                                            newSelected.delete(toRemove);
                                                        }
                                                    }
                                                    setSelectedLoggers(newSelected);
                                                }}
                                            />
                                            <span>
                                                {name}
                                                {!hasEntries && <span className="no-entries-hint"> (no entries)</span>}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="session-logs">
                        {Array.from(entriesByLogger.entries()).map(([loggerName, entries]) => {
                            const isExpanded = expandedLoggers.has(loggerName);
                            return (
                                <div key={loggerName} className="logger-section">
                                    <div
                                        className="logger-section-header"
                                        onClick={() => {
                                            const newExpanded = new Set(expandedLoggers);
                                            if (isExpanded) {
                                                newExpanded.delete(loggerName);
                                            } else {
                                                newExpanded.add(loggerName);
                                            }
                                            setExpandedLoggers(newExpanded);
                                        }}
                                    >
                                        <div className="logger-section-title">
                                            <span className="collapse-icon">{isExpanded ? '▼' : '▶'}</span>
                                            <h3>{loggerName}</h3>
                                        </div>
                                        <span className="entry-count">{entries.length} entries</span>
                                    </div>
                                    {isExpanded && (
                                        <div className="logger-entries">
                                            {entries.map((entry, index) => (
                                                <div
                                                    key={index}
                                                    className={`log-entry ${entry.isSeparator ? 'separator' : ''}`}
                                                >
                                                    <div className="log-entry-time">
                                                        {entry.timestamp ? formatTime(entry.timestamp) : 'No timestamp'}
                                                    </div>
                                                    <div className="log-entry-message">{entry.message}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <SessionTimelineView
                    entries={sessionData.entries}
                    loggerNames={logs.loggerNames}
                    sessionStartTime={sessionData.startTime}
                />
            )}
        </div>
    );
}
