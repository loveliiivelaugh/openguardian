import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Divider, Stack, Paper, TextField, IconButton, Button, Tooltip, MenuItem, Select } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useSimulator } from '@store/useSimulator';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@api/index';
import { CodeEditorWithSuggestions } from './CodeEditorWithSuggestions';
import { useFlowStore } from '@store/v2/flowStore';
import { ContextReferencePanel } from './ContextReferencePanel';


type NodeInspectProps = {
    node: any;
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Box mb={2}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            {title}
        </Typography>
        <Paper variant="outlined" sx={{ p: 1, backgroundColor: '#101927' }}>
            {children}
        </Paper>
    </Box>
);

const JsonViewer = ({ data }: { data: any }) => (
    <Box component="pre" sx={{ fontSize: 12, whiteSpace: 'pre-wrap', color: '#d0d0d0' }}>
        {JSON.stringify(data, null, 2)}
    </Box>
);

export const NodeInspectModalContentLegacy = ({ node }: NodeInspectProps) => {
    const {
        id,
        run,
        type,
        label,
        args = {},
        args_schema = {},
        result,
        config,
        data = {},
        position,
    } = node || {};

    return (
        <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <Box p={2}>
                <Typography variant="h6" gutterBottom>
                    🧩 Node: <strong>{label || id}</strong>
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                    <Section title="🔖 Metadata">
                        <Typography variant="body2">ID: <strong>{id}</strong></Typography>
                        <Typography variant="body2">Run: <strong>{run}</strong></Typography>
                        <Typography variant="body2">Type: <strong>{type}</strong></Typography>
                        <Typography variant="body2">Label: <strong>{label}</strong></Typography>
                        {position && (
                            <Typography variant="body2">Position: ({position.x}, {position.y})</Typography>
                        )}
                    </Section>

                    <Section title="📦 Args">
                        <JsonViewer data={args} />
                    </Section>

                    {args_schema && Object.keys(args_schema).length > 0 && (
                        <Section title="🧠 Args Schema">
                            <JsonViewer data={args_schema} />
                        </Section>
                    )}

                    {config && Object.keys(config).length > 0 && (
                        <Section title="⚙️ Config">
                            <JsonViewer data={config} />
                        </Section>
                    )}

                    {result && (
                        <Section title="📈 Result">
                            <JsonViewer data={result} />
                        </Section>
                    )}
                </Stack>
            </Box>
        </motion.div>
    );
};


const SectionNew = ({
    title,
    children,
    actions
}: {
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}) => (
    <Box mb={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="subtitle2" fontWeight={700}>{title}</Typography>
            {actions}
        </Stack>
        <Paper variant="outlined" sx={{ p: 1.5, backgroundColor: '#101927' }}>
            {children}
        </Paper>
    </Box>
);

const globalVars = [
    '{{flowId}}',
    '{{userId}}',
    '{{projectName}}',
    '{{now}}'
];
  
export const NodeInspectModalContent = ({ node }: { node: any }) => {
    const { currentContext } = useFlowStore();
    const simulatorStore = useSimulator();
    const {
        id,
        run: initialRun,
        type: initialType,
        label: initialLabel,
        args = {},
        args_schema = {},
        result = {},
        config = {},
        position
    } = node || {};

    const [editableArgs, setEditableArgs] = useState(JSON.stringify(args, null, 2));
    const [editableResult, setEditableResult] = useState(JSON.stringify(result, null, 2));
    const [label, setLabel] = useState(initialLabel);
    const [run, setRun] = useState(initialRun);
    const [type, setType] = useState(initialType);
    const [currentGlobalVars, setCurrentGlobalVars] = useState(globalVars);

    const { data: functionsData } = useQuery(queries.query('/database/read_db/function_registry'));
    const functionOptions = functionsData?.data?.map((f: any) => f.name) || [];

    const handleArgsUpdate = () => {
        try {
            const parsed = JSON.parse(editableArgs);
            simulatorStore.setActiveAgentFlowData(id, { args: parsed });
        } catch (err) {
            console.error('Invalid JSON in args field', err);
        }
    };

    const handleResultUpdate = () => {
        try {
            const parsed = JSON.parse(editableResult);
            simulatorStore.setActiveAgentFlowData(id, { result: parsed });
        } catch (err) {
            console.error('Invalid JSON in result field', err);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleEnrich = async () => {
        // stub enrichment logic
        const enriched = { args: { ...args, enriched: true }, description: 'LLM enriched' };
        simulatorStore.setActiveAgentFlowData(id, enriched);
    };

    const handleUpdateField = (field: string, value: any) => {
        simulatorStore.setActiveAgentFlowData(id, { [field]: value });
    };

    return (
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
            <Box p={2}>
                <Typography variant="h6" gutterBottom>
                    🧩 Node: <strong>{label || id}</strong>
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                    <SectionNew title="🔖 Metadata">
                        {/* <Typography variant="body2">ID: <strong>{id}</strong></Typography>
            <Typography variant="body2">Run: <strong>{run}</strong></Typography>
            <Typography variant="body2">Type: <strong>{type}</strong></Typography>
            <Typography variant="body2">Label: <strong>{label}</strong></Typography>
            {position && (
              <Typography variant="body2">Position: ({position.x}, {position.y})</Typography>
            )} */}
                        <Stack spacing={1}>
                            <Typography variant="body2">ID: <strong>{id}</strong></Typography>
                            <Typography variant="body2">
                                Run:
                                <Select
                                    size="small"
                                    value={run || ''}
                                    onChange={(e) => {
                                        setRun(e.target.value);
                                        handleUpdateField('run', e.target.value);
                                    }}
                                    sx={{ ml: 1, minWidth: 150 }}
                                >
                                    {[...functionOptions, run].map((name: string) => (
                                        <MenuItem key={name} value={name}>{name}</MenuItem>
                                    ))}
                                </Select>
                            </Typography>
                            <Typography variant="body2">
                                Type:
                                <Select
                                    size="small"
                                    value={type || ''}
                                    onChange={(e) => {
                                        setType(e.target.value);
                                        handleUpdateField('type', e.target.value);
                                    }}
                                    sx={{ ml: 1, minWidth: 120 }}
                                >
                                    <MenuItem value="agent">agent</MenuItem>
                                    <MenuItem value="function">function</MenuItem>
                                    <MenuItem value="trigger">trigger</MenuItem>
                                    <MenuItem value="output">output</MenuItem>
                                </Select>
                            </Typography>
                            <Typography variant="body2">
                                Label:
                                <TextField
                                    size="small"
                                    variant="standard"
                                    value={label || ''}
                                    onChange={(e) => {
                                        setLabel(e.target.value);
                                        handleUpdateField('label', e.target.value);
                                    }}
                                    sx={{ ml: 1 }}
                                />
                            </Typography>
                            {position && (
                                <Typography variant="body2">Position: ({position.x}, {position.y})</Typography>
                            )}
                        </Stack>
                    </SectionNew>

                    <SectionNew
                        title="📦 Args"
                        actions={
                            <Stack direction="row" spacing={1}>
                                <Tooltip title="Copy Args">
                                    <IconButton size="small" onClick={() => handleCopy(editableArgs)}>
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Button size="small" onClick={handleEnrich} startIcon={<AutoFixHighIcon />}>
                                    Enrich with LLM
                                </Button>
                            </Stack>
                        }
                    >
                        <CodeEditorWithSuggestions
                            nodeId={id}
                            value={editableArgs}
                            //   onChange={setEditableArgs}
                            onChange={(v) => {
                                try {
                                    const parsed = JSON.parse(v);
                                    simulatorStore.setActiveAgentFlowData(id, parsed);
                                } catch {
                                    console.warn('Invalid JSON');
                                }
                            }}
                            context={currentContext || {}}
                        />
                        {/* <TextField
              multiline
              fullWidth
              minRows={4}
              value={editableArgs}
              onChange={(e) => setEditableArgs(e.target.value)}
              onBlur={handleArgsUpdate}
              sx={{ fontFamily: 'monospace', color: '#eee' }}
            /> */}
                    </SectionNew>

                    {args_schema && Object.keys(args_schema).length > 0 && (
                        <SectionNew title="🧠 Args Schema">
                            <Box component="pre" sx={{ fontSize: 12, color: '#d0d0d0', whiteSpace: 'pre-wrap' }}>
                                {JSON.stringify(args_schema, null, 2)}
                            </Box>
                        </SectionNew>
                    )}

                    {config && Object.keys(config).length > 0 && (
                        <SectionNew title="⚙️ Config">
                            <Box component="pre" sx={{ fontSize: 12, color: '#d0d0d0', whiteSpace: 'pre-wrap' }}>
                                {JSON.stringify(config, null, 2)}
                            </Box>
                        </SectionNew>
                    )}

                    <SectionNew
                        title="📈 Result"
                        actions={
                            <Tooltip title="Copy Result">
                                <IconButton size="small" onClick={() => handleCopy(editableResult)}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        }
                    >
                        <TextField
                            multiline
                            fullWidth
                            minRows={3}
                            value={editableResult}
                            onChange={(e) => setEditableResult(e.target.value)}
                            onBlur={handleResultUpdate}
                            sx={{ fontFamily: 'monospace', color: '#eee' }}
                        />
                    </SectionNew>

                    <SectionNew
                        title="📈 Result"
                        actions={
                            <Tooltip title="Copy Result">
                                <IconButton size="small" onClick={() => handleCopy(editableResult)}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        }
                    >
                        <ContextReferencePanel
                            context={currentContext || {}}
                            memories={[]}
                            globalVars={currentGlobalVars || []}
                            snippets={[]}
                        />
                    </SectionNew>
                </Stack>
            </Box>
        </motion.div>
    );
};
