import { useState, useMemo } from 'react';
import {
    Card, CardContent, Typography, Chip, Box, Stack, TextField, InputAdornment,
    IconButton, Tooltip, CardActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { motion } from 'framer-motion';
import Fuse from 'fuse.js';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@api/index';

interface PrewrittenPrompt {
    id: string;
    title: string;
    description: string;
    prompt: string;
    tags: string[];
    created_by: string;
    created_at: string;
}

export default function PrewrittenPrompts() {
    const { data: promptsData, isLoading, error } = useQuery(queries.query("/database/read_db/prewritten_prompts"));
    const data = promptsData?.data || [];

    const [search, setSearch] = useState('');
    const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

    const fuse = useMemo(
        () =>
            new Fuse(data, {
                keys: ['title', 'description', 'prompt', 'tags'],
                threshold: 0.3,
            }),
        [data]
    );

    const filtered = useMemo(() => {
        if (!search) return data;
        return fuse.search(search).map((r) => r.item);
    }, [search, fuse]);

    const handleCopy = async (prompt: string, id: string) => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopiedPromptId(id);
            setTimeout(() => setCopiedPromptId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (isLoading) return <Typography p={2}>Loading prompts...</Typography>;
    if (error) return <Typography p={2}>Failed to load prompts</Typography>;

    return (
        <Box p={2} component={motion.div} sx={{ width: 600 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.95)',
                    // background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    zIndex: 1,
                    pb: 1,
                    pt: 2,
                    px: 1,
                    backgroundClip: 'padding-box',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Prewritten Prompts
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Search prompts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Stack spacing={2}>
                {filtered.map((prompt: PrewrittenPrompt) => (
                    <Card
                        key={prompt.id}
                        component={motion.div}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <CardContent>
                        <Tooltip title={copiedPromptId === prompt.id ? 'Copied!' : 'Copy prompt ID'}>
                            <IconButton onClick={() => handleCopy(prompt.id, prompt.id)}>
                                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                    {prompt.id}
                                </Typography>
                            </IconButton>
                        </Tooltip>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                {prompt.title || prompt.id}
                            </Typography>
                            {prompt.description && (
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {prompt.description}
                                </Typography>
                            )}
                            <Typography
                                variant="body2"
                                sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', mt: 1 }}
                            >
                                {prompt.prompt}
                            </Typography>
                            <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                                {prompt.tags?.map((tag) => (
                                    <Chip key={tag} size="small" label={tag} variant="outlined" />
                                ))}
                            </Box>
                        </CardContent>
                        <CardActions sx={{ pl: 2 }}>
                            <Tooltip title={copiedPromptId === prompt.id ? 'Copied!' : 'Copy prompt'}>
                                <IconButton onClick={() => handleCopy(prompt.prompt, prompt.id)}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Use this prompt">
                                <IconButton onClick={() => console.log('Use:', prompt)}>
                                    <PlayArrowIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit prompt (coming soon)">
                                <IconButton disabled>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </CardActions>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
}
