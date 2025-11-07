import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { FileUpload } from './components/FileUpload';
import { SessionDetail } from './components/SessionDetail';
import { SessionsList } from './components/SessionsList';
import type { ParsedLogs } from './utils/logParser';

function App() {
    const [parsedLogs, setParsedLogs] = useState<ParsedLogs | null>(null);

    const handleLogsParsed = (logs: ParsedLogs) => {
        setParsedLogs(logs);
    };

    const handleReset = () => {
        setParsedLogs(null);
    };

    return (
        <BrowserRouter>
            <div className="app">
                <div className="app-header">
                    <h1>iLogger Visualizer</h1>
                    {parsedLogs && (
                        <button onClick={handleReset} className="reset-button">
                            Upload New File
                        </button>
                    )}
                </div>

                <Routes>
                    <Route
                        path="/"
                        element={
                            parsedLogs ? (
                                <Navigate to="/sessions" replace />
                            ) : (
                                <FileUpload onLogsParsed={handleLogsParsed} />
                            )
                        }
                    />
                    <Route
                        path="/sessions"
                        element={
                            parsedLogs ? (
                                <SessionsList logs={parsedLogs} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route
                        path="/sessions/:sessionId"
                        element={
                            parsedLogs ? (
                                <SessionDetail logs={parsedLogs} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
