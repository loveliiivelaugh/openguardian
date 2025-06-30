import { Box, Typography, Chip, Divider, Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import { TerminalLogScroller } from "../TerminalLogScroller";
import { useWebSocketStore } from "@hooks/useWebsocket";
import useUtilityStore from "@store/utilityStore";
import { FlowExecutionDrawer } from "../FlowExecutionDrawer";

export default function FlowSummary({ flow }: { flow: any }) {
    const utilityStore = useUtilityStore();
    const { logs } = useWebSocketStore();
    const results = flow?.results || [];
    const startedAt = new Date(flow?.created_at).toLocaleString();

    return (
        <Box p={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                ✅ Flow Completed
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Flow:</strong> {flow.name || "Untitled Flow"} <br />
                <strong>Started:</strong> {startedAt} <br />
                <strong>Steps:</strong> {results.length}
            </Typography>

            {/* @ts-ignore */}
            <Button color="text.secondary" variant="outlined" onClick={() => {
                utilityStore.setDrawer({ open: false });
                setTimeout(() => utilityStore.setDrawer({ 
                    open: true,
                    anchor: "right",
                    content: (
                        <FlowExecutionDrawer 
                            flow={flow}
                            onApprove={() => {/* TODO: pipe approve logic here. */}}
                            onClose={() => utilityStore.setDrawer({ open: false, anchor: "right", content: null })}
                        />
                    )
                }), 500);
            }}>
                ← Back to Editor
            </Button>

            <Divider sx={{ my: 2 }} />

            <TerminalLogScroller logStream={logs} noInfo sx={{ height: 300 }} />

            <Divider sx={{ my: 2 }} />

            {results.map((step: any, index: number) => (
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Accordion disableGutters sx={{ mb: 1, borderRadius: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>
                                {index + 1}. {step?.data?.label || step.label || step.name || "Unnamed Step"}
                            </Typography>
                            <Chip
                                label={step.status || "Unknown"}
                                size="small"
                                color={step.status === "success" ? "success" : step.status === "error" ? "error" : "default"}
                                sx={{ ml: 2 }}
                            />
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                Step ID: {step.id} <br />
                                Type: {step.type || step?.data?.type || "n/a"}
                            </Typography>
                            {step?.result && (
                                <pre style={{ fontSize: "0.75rem", background: "#1e1e1e", color: "#fff", padding: "8px", borderRadius: 4 }}>
                                    {JSON.stringify(step.result, null, 2)}
                                </pre>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </motion.div>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box display="flex" gap={2} justifyContent="flex-end">
                <Button variant="outlined" color="primary">
                    🔁 Rerun Flow
                </Button>
                <Button variant="outlined" color="secondary">
                    🧪 Fork Flow
                </Button>
                <Button variant="contained" color="success">
                    ✨ Save as Automation
                </Button>
            </Box>
        </Box>
    );
}
