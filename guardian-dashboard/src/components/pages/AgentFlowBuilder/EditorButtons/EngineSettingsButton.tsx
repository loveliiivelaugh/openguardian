import { Button, Stack, Grid, Typography, Alert, TextField, Select, MenuItem, Switch, Slider, Box } from "@mui/material";
import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { useUtilityStore } from "@store/index";
import useAgentFlowBuilder from "../useAgentFlowBuilder";
import { TerminalLogScroller } from "@components/Custom/Agents/TerminalLogScroller";
import MultipleSelectChip from '@components/Custom/forms/MultiSelect';
import Tabs from "@components/Mui/Tabs";


const EngineSettingsButton = () => {
    const { orchestratorConfig, flowData } = useAgentFlowBuilder();
    const { setDrawer } = useUtilityStore();
    return (
        <Button variant="outlined" onClick={() => setDrawer({
            open: true,
            anchor: 'bottom',
            // @ts-ignore
            boxStyle: {
                maxHeight: '70vh',
                overflow: 'auto'
            },
            content: (
                <Stack spacing={2} px={6} py={2}>
                    <Tabs
                        tabs={[
                            { label: "Engine Settings" },
                            { label: "Engine Vision" },
                        ]}
                        renderContent={(tab: number) => ({
                            0: (
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <Typography variant="h4">Orchestrator Engine Settings</Typography>
                                        <Alert severity="info">
                                            This will set the default AgentFlows for Event's and the running Loop in the AgentEngine
                                        </Alert>
                                    </Grid>
                                    <Grid size={6}>
                                        {orchestratorConfig && (
                                            <>
                                                {Object
                                                    .keys(orchestratorConfig)
                                                    .map((key) =>
                                                        <>
                                                            <Typography variant="body1">{key}</Typography>
                                                            {/* @ts-ignore */}
                                                            {({
                                                                string: <TextField fullWidth placeholder={key} value={orchestratorConfig[key]} />,
                                                                object: Array.isArray(orchestratorConfig[key])
                                                                    ? (
                                                                        <Select fullWidth value={flowData.find(({ id }: { id: string }) => id === orchestratorConfig[key])?.name}>
                                                                            {orchestratorConfig[key].map((flow: any) => (
                                                                                <MenuItem key={flow.id} value={flow.id}>
                                                                                    {flow?.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    ) : <>{/* make this recursive and loop over the data */}</>,
                                                                boolean: <Switch value={orchestratorConfig[key]} />
                                                            }[typeof orchestratorConfig[key] || "string"]
                                                            )}
                                                        </>
                                                    )
                                                }
                                            </>
                                        )}
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography variant="body1">onEvent AgentFlow</Typography>
                                        <Select
                                            fullWidth
                                            value={flowData.find(({ id }: { id: string }) => id === orchestratorConfig.on_event_flow_id)?.name}
                                            onChange={(e) => {
                                                const flow = flowData.find(({ id }: { id: string }) => id === e.target.value)
                                            }}
                                        >
                                            {flowData.map((flow: any, idx: number) => (
                                                <MenuItem key={idx} value={flow.id}>
                                                    {flow.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <Typography variant="body1">onLoop AgentFlow</Typography>
                                        <Select fullWidth value={flowData.find(({ id }: { id: string }) => id === orchestratorConfig.fallback_loop_flow_id)?.name}>
                                            {flowData.map((flow: any, idx: number) => (
                                                <MenuItem key={idx} value={flow.id}>
                                                    {flow.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <Typography variant="body1">Engine Agents</Typography>
                                        <MultipleSelectChip value={orchestratorConfig.agents} onChange={(value) => { }} />
                                        <Typography variant="body1">Engine Tempo</Typography>
                                        <Box sx={{ mt: 2, display: "flex" }}>
                                            <VolumeDown />
                                            <Slider aria-label="tempo" value={40} onChange={() => { }} />
                                            <VolumeUp />
                                        </Box>
                                        <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "end" }}>
                                            <Button variant="contained" onClick={() => orchestratorConfig && (orchestratorConfig.pause = true)}>Pause</Button>
                                            <Button variant="contained" onClick={() => orchestratorConfig && (orchestratorConfig.pause = false)}>Continue</Button>
                                        </Box>
                                        <Typography variant="body1">Default LLM Model</Typography>
                                        <Select fullWidth value="gemini-2.0-flash">
                                            {[
                                                { name: "gemini-2.0-flash" },
                                                { name: "gpt-4o" },
                                                { name: "llama3.1" },
                                            ].map((flow: any, idx: number) => (
                                                <MenuItem key={idx} value={flow.id}>
                                                    {flow.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                </Grid>
                            ),
                            1: (
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <Typography variant="h4">Engine Vision Settings</Typography>
                                        <Alert severity="info">
                                            This will set the default AgentFlows for Event's and the running Loop in the AgentEngine
                                        </Alert>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography variant="body1">Agent Logs</Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography variant="body1">Agent Logs</Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <TerminalLogScroller logStream={[
                                            "Agent 1",
                                            "Agent 2",
                                            "Agent 3",
                                        ]} />
                                    </Grid>
                                </Grid>
                            )
                        }[tab])}
                    />
                </Stack>
            )
        })}>👷 Set Engine Defaults</Button>
    )
}

export default EngineSettingsButton;
export { EngineSettingsButton}
    