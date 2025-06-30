import { Box, Typography, Paper, Chip, Divider, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { TerminalLogScroller } from '../TerminalLogScroller';

type FlowResultProps = {
    result: {
        status: string;
        result: {
            currentStep: string;
            logs: string[];
            [key: string]: any;
        };
    };
};

export const FlowExecutionResult = ({ result }: FlowResultProps) => {
    const { status, result: execution } = result;
    const { currentStep, logs, ...steps } = execution;

    const logEntries = logs || [];

    const stepResults = Object.entries(steps).filter(
        ([key]) => key !== 'logs' && key !== 'currentStep'
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Paper elevation={3} sx={{ p: 3, bgcolor: '#0e1a2b', color: '#fff' }}>
                <Typography variant="h6" gutterBottom>
                    🧠 Flow Execution Result
                </Typography>

                <Box mb={2}>
                    <Chip label={`Status: ${status}`} color="success" size="small" />
                    <Chip
                        label={`Current Step: ${currentStep}`}
                        color="primary"
                        size="small"
                        sx={{ ml: 1 }}
                    />
                </Box>

                <Divider sx={{ my: 2 }}>📜 Logs</Divider>
                <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
                    {logEntries.map((log, idx) => (
                        <Typography
                            key={idx}
                            variant="caption"
                            sx={{ display: 'block', fontFamily: 'monospace' }}
                        >
                            {log}
                        </Typography>
                    ))}

                </Box>

                <Divider sx={{ my: 2 }}>📜 Terminal Logs</Divider>
                <TerminalLogScroller logStream={logEntries} />

                <Divider sx={{ my: 2 }}>⏱️ Step Durations</Divider>
                <Stack spacing={1}>
                    {stepResults.map(([id, { durationMs, result }]) => (
                        <Paper
                            key={id}
                            variant="outlined"
                            sx={{ p: 1, bgcolor: '#1c2c3d', color: '#aaf' }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Step ID: {id}
                            </Typography>
                            <Typography variant="body2">
                                Duration: {durationMs}ms
                            </Typography>
                            {result && (
                                <Typography variant="caption" sx={{ color: '#ccc' }}>
                                    Result: {JSON.stringify(result)}
                                </Typography>
                            )}
                        </Paper>
                    ))}
                </Stack>
            </Paper>
        </motion.div>
    );
};
