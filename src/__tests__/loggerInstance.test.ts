import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoggerInstance } from '../loggerInstance';
import { StorageAdapter } from '../storageAdapter';

describe('LoggerInstance', () => {
    let mockStorage: StorageAdapter;
    let logger: LoggerInstance;
    let consoleLogSpy: ReturnType<typeof vi.spyOn>;
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        // Create a mock storage adapter
        mockStorage = {
            append: vi.fn().mockResolvedValue(undefined),
        } as unknown as StorageAdapter;

        // Spy on console methods
        consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Constructor', () => {
        it('should create an instance with required parameters', () => {
            logger = new LoggerInstance('test-logger', mockStorage);
            expect(logger).toBeInstanceOf(LoggerInstance);
        });

        it('should create an instance with all parameters', () => {
            logger = new LoggerInstance('test-logger', mockStorage, true, true, true);
            expect(logger).toBeInstanceOf(LoggerInstance);
        });

        it('should default withTimestamps to true', () => {
            logger = new LoggerInstance('test-logger', mockStorage);
            logger.writeLog('test message');

            // Wait for async append
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalledWith(
                        expect.objectContaining({
                            name: 'test-logger',
                            message: 'test message',
                            timestamp: expect.any(String),
                        })
                    );
                    resolve();
                }, 10);
            });
        });

        it('should default consoleLogging to false', () => {
            logger = new LoggerInstance('test-logger', mockStorage);
            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(consoleLogSpy).not.toHaveBeenCalled();
                    resolve();
                }, 10);
            });
        });

        it('should default enabled to true', () => {
            logger = new LoggerInstance('test-logger', mockStorage);
            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalled();
                    resolve();
                }, 10);
            });
        });
    });

    describe('writeLog', () => {
        beforeEach(() => {
            logger = new LoggerInstance('test-logger', mockStorage, true, false, true);
        });

        it('should write a simple string message', () => {
            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalledWith(
                        expect.objectContaining({
                            name: 'test-logger',
                            message: 'test message',
                            timestamp: expect.any(String),
                        })
                    );
                    resolve();
                }, 10);
            });
        });

        it('should write multiple string arguments', () => {
            logger.writeLog('message', 'part', 'two');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalledWith(
                        expect.objectContaining({
                            name: 'test-logger',
                            message: 'message part two',
                            timestamp: expect.any(String),
                        })
                    );
                    resolve();
                }, 10);
            });
        });

        it('should serialize objects to JSON', () => {
            const obj = { key: 'value', number: 42 };
            logger.writeLog(obj);

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalledWith(
                        expect.objectContaining({
                            name: 'test-logger',
                            message: JSON.stringify(obj),
                            timestamp: expect.any(String),
                        })
                    );
                    resolve();
                }, 10);
            });
        });

        it('should handle Error objects with message and stack', () => {
            const error = new Error('Test error');
            logger.writeLog(error);

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalledWith(
                        expect.objectContaining({
                            name: 'test-logger',
                            message: expect.stringContaining('Test error'),
                            timestamp: expect.any(String),
                        })
                    );
                    const callArgs = (mockStorage.append as any).mock.calls[0][0];
                    expect(callArgs.message).toContain('Test error');
                    expect(callArgs.message).toContain('Error: Test error');
                    resolve();
                }, 10);
            });
        });

        it('should handle mixed argument types', () => {
            const obj = { data: 'test' };
            const error = new Error('Error occurred');
            logger.writeLog('Message:', obj, error);

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalledWith(
                        expect.objectContaining({
                            name: 'test-logger',
                            message: expect.stringContaining('Message:'),
                            timestamp: expect.any(String),
                        })
                    );
                    const callArgs = (mockStorage.append as any).mock.calls[0][0];
                    expect(callArgs.message).toContain('Message:');
                    expect(callArgs.message).toContain(JSON.stringify(obj));
                    expect(callArgs.message).toContain('Error occurred');
                    resolve();
                }, 10);
            });
        });

        it('should include timestamp when withTimestamps is true', () => {
            logger = new LoggerInstance('test-logger', mockStorage, true, false, true);
            logger.writeLog('test');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalledWith(
                        expect.objectContaining({
                            timestamp: expect.any(String),
                        })
                    );
                    const callArgs = (mockStorage.append as any).mock.calls[0][0];
                    expect(callArgs.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
                    resolve();
                }, 10);
            });
        });

        it('should not include timestamp when withTimestamps is false', () => {
            logger = new LoggerInstance('test-logger', mockStorage, false, false, true);
            logger.writeLog('test');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalledWith(
                        expect.objectContaining({
                            timestamp: undefined,
                        })
                    );
                    resolve();
                }, 10);
            });
        });

        it('should log to console when consoleLogging is true', () => {
            logger = new LoggerInstance('test-logger', mockStorage, true, true, true);
            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(consoleLogSpy).toHaveBeenCalledWith('[test-logger]', 'test message');
                    resolve();
                }, 10);
            });
        });

        it('should not log to console when consoleLogging is false', () => {
            logger = new LoggerInstance('test-logger', mockStorage, true, false, true);
            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(consoleLogSpy).not.toHaveBeenCalled();
                    resolve();
                }, 10);
            });
        });

        it('should not write to storage when enabled is false', () => {
            logger = new LoggerInstance('test-logger', mockStorage, true, false, false);
            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).not.toHaveBeenCalled();
                    resolve();
                }, 10);
            });
        });

        it('should still log to console when disabled but consoleLogging is true', () => {
            logger = new LoggerInstance('test-logger', mockStorage, true, true, false);
            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).not.toHaveBeenCalled();
                    expect(consoleLogSpy).toHaveBeenCalledWith('[test-logger]', 'test message');
                    resolve();
                }, 10);
            });
        });

        it('should handle storage append errors gracefully', () => {
            const error = new Error('Storage error');
            (mockStorage.append as any).mockRejectedValueOnce(error);

            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(consoleErrorSpy).toHaveBeenCalledWith(
                        'Failed to write log to storage:',
                        error
                    );
                    resolve();
                }, 10);
            });
        });

        it('should handle empty arguments', () => {
            logger.writeLog();

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalledWith(
                        expect.objectContaining({
                            name: 'test-logger',
                            message: '',
                            timestamp: expect.any(String),
                        })
                    );
                    resolve();
                }, 10);
            });
        });

        it('should handle null and undefined values', () => {
            logger.writeLog(null, undefined, 'message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalledWith(
                        expect.objectContaining({
                            name: 'test-logger',
                            message: expect.stringContaining('message'),
                            timestamp: expect.any(String),
                        })
                    );
                    resolve();
                }, 10);
            });
        });

        it('should handle numbers and booleans', () => {
            logger.writeLog(42, true, false);

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    const callArgs = (mockStorage.append as any).mock.calls[0][0];
                    expect(callArgs.message).toContain('42');
                    expect(callArgs.message).toContain('true');
                    expect(callArgs.message).toContain('false');
                    resolve();
                }, 10);
            });
        });
    });

    describe('setConsoleLogging', () => {
        beforeEach(() => {
            logger = new LoggerInstance('test-logger', mockStorage, true, false, true);
        });

        it('should enable console logging', () => {
            logger.setConsoleLogging(true);
            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(consoleLogSpy).toHaveBeenCalledWith('[test-logger]', 'test message');
                    resolve();
                }, 10);
            });
        });

        it('should disable console logging', () => {
            logger = new LoggerInstance('test-logger', mockStorage, true, true, true);
            logger.setConsoleLogging(false);
            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(consoleLogSpy).not.toHaveBeenCalled();
                    resolve();
                }, 10);
            });
        });

        it('should toggle console logging multiple times', () => {
            logger.setConsoleLogging(true);
            logger.writeLog('message 1');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(consoleLogSpy).toHaveBeenCalledTimes(1);

                    logger.setConsoleLogging(false);
                    logger.writeLog('message 2');

                    setTimeout(() => {
                        expect(consoleLogSpy).toHaveBeenCalledTimes(1); // Still 1

                        logger.setConsoleLogging(true);
                        logger.writeLog('message 3');

                        setTimeout(() => {
                            expect(consoleLogSpy).toHaveBeenCalledTimes(2);
                            resolve();
                        }, 10);
                    }, 10);
                }, 10);
            });
        });
    });

    describe('setTimestamps', () => {
        beforeEach(() => {
            logger = new LoggerInstance('test-logger', mockStorage, true, false, true);
        });

        it('should enable timestamps', () => {
            logger.setTimestamps(true);
            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalledWith(
                        expect.objectContaining({
                            timestamp: expect.any(String),
                        })
                    );
                    resolve();
                }, 10);
            });
        });

        it('should disable timestamps', () => {
            logger.setTimestamps(false);
            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalledWith(
                        expect.objectContaining({
                            timestamp: undefined,
                        })
                    );
                    resolve();
                }, 10);
            });
        });

        it('should toggle timestamps multiple times', () => {
            logger.setTimestamps(false);
            logger.writeLog('message 1');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    let callArgs = (mockStorage.append as any).mock.calls[0][0];
                    expect(callArgs.timestamp).toBeUndefined();

                    logger.setTimestamps(true);
                    logger.writeLog('message 2');

                    setTimeout(() => {
                        callArgs = (mockStorage.append as any).mock.calls[1][0];
                        expect(callArgs.timestamp).toBeDefined();

                        logger.setTimestamps(false);
                        logger.writeLog('message 3');

                        setTimeout(() => {
                            callArgs = (mockStorage.append as any).mock.calls[2][0];
                            expect(callArgs.timestamp).toBeUndefined();
                            resolve();
                        }, 10);
                    }, 10);
                }, 10);
            });
        });
    });

    describe('setEnabled', () => {
        beforeEach(() => {
            logger = new LoggerInstance('test-logger', mockStorage, true, false, true);
        });

        it('should disable logging to storage', () => {
            logger.setEnabled(false);
            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).not.toHaveBeenCalled();
                    resolve();
                }, 10);
            });
        });

        it('should enable logging to storage', () => {
            logger = new LoggerInstance('test-logger', mockStorage, true, false, false);
            logger.setEnabled(true);
            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalled();
                    resolve();
                }, 10);
            });
        });

        it('should toggle enabled state multiple times', () => {
            logger.setEnabled(false);
            logger.writeLog('message 1');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).not.toHaveBeenCalled();

                    logger.setEnabled(true);
                    logger.writeLog('message 2');

                    setTimeout(() => {
                        expect(mockStorage.append).toHaveBeenCalledTimes(1);

                        logger.setEnabled(false);
                        logger.writeLog('message 3');

                        setTimeout(() => {
                            expect(mockStorage.append).toHaveBeenCalledTimes(1); // Still 1
                            resolve();
                        }, 10);
                    }, 10);
                }, 10);
            });
        });

        it('should allow console logging when disabled', () => {
            logger = new LoggerInstance('test-logger', mockStorage, true, true, true);
            logger.setEnabled(false);
            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).not.toHaveBeenCalled();
                    expect(consoleLogSpy).toHaveBeenCalledWith('[test-logger]', 'test message');
                    resolve();
                }, 10);
            });
        });
    });

    describe('Integration tests', () => {
        beforeEach(() => {
            logger = new LoggerInstance('test-logger', mockStorage, true, false, true);
        });

        it('should handle multiple writeLog calls', () => {
            logger.writeLog('message 1');
            logger.writeLog('message 2');
            logger.writeLog('message 3');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalledTimes(3);
                    resolve();
                }, 10);
            });
        });

        it('should work with all settings changed dynamically', () => {
            logger.setTimestamps(false);
            logger.setConsoleLogging(true);
            logger.setEnabled(true);

            logger.writeLog('test message');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(mockStorage.append).toHaveBeenCalledWith(
                        expect.objectContaining({
                            timestamp: undefined,
                        })
                    );
                    expect(consoleLogSpy).toHaveBeenCalled();
                    resolve();
                }, 10);
            });
        });

        it('should handle complex error scenarios', () => {
            const error = new Error('Complex error');
            error.stack = 'Error: Complex error\n    at test.js:1:1';

            logger.writeLog('Error occurred:', error, { context: 'test' });

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    const callArgs = (mockStorage.append as any).mock.calls[0][0];
                    expect(callArgs.message).toContain('Error occurred:');
                    expect(callArgs.message).toContain('Complex error');
                    expect(callArgs.message).toContain('Error: Complex error');
                    expect(callArgs.message).toContain('context');
                    resolve();
                }, 10);
            });
        });
    });
});
