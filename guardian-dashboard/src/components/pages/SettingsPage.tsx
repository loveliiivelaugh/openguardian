import {
    Box, Typography, Stack, TextField, Button,
    Paper, Avatar, ListItemText,
    Switch, Divider, Alert
} from '@mui/material'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import Tabs from '@components/Mui/Tabs'
import ReusableTable from '@components/custom/charts/ReusableTable'
import FormContainer from '@components/custom/forms/FormContainer'
// import MemorySphereScene from '@components/custom/MemorySphere5'
import { useSupabaseStore, useUtilityStore } from '@store/index'
import { queries } from '@api/index'


export const ProfileContent = ({ profile, setProfile }: { profile: any, setProfile: any }) => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={3}>
            <Box display="flex" p={2} gap={2}>
                <Avatar src={profile.avatar_url} />
                <Typography variant="h6" gutterBottom>
                    Account
                </Typography>
            </Box>
            <TextField
                label="Email"
                value={profile.email}
                fullWidth
            />
            <TextField
                label="Display Name"
                value={profile.name || ''}
                onChange={(e) => setProfile.mutate({ ...profile, name: e.target.value })}
                fullWidth
            />
            <TextField
                label="Username"
                value={profile.username || ''}
                onChange={(e) => setProfile.mutate({ ...profile, username: e.target.value })}
                fullWidth
            />
            <Button variant="contained" color="primary">
                Update
            </Button>
            <Typography variant="h6" gutterBottom>
                API Keys
            </Typography>
            <TextField
                label="API Key"
                value={profile.api_key || ''}
                fullWidth
            />
            <Button variant="outlined" color="error">
                Regenerate API Key
            </Button>
            <Typography variant="h6" gutterBottom>
                Encryption
            </Typography>
            <TextField
                label="Encryption Key"
                value={profile.encryption_key || ''}
                fullWidth
            />
            <Button variant="outlined" color="error">
                Regenerate Encryption Key
            </Button>
            <Box sx={{ display: 'flex' }}>
                <ListItemText
                    primary="End-to-end Encryption"
                    secondary="Enable end-to-end encryption for your memories. This means only you can decrypt and read your memories."
                />
                <Switch
                    checked={profile.end_to_end_encryption}
                    onChange={(e: any) => setProfile.mutate({ ...profile, end_to_end_encryption: e.target.checked })}
                />
            </Box>
            <Button variant="contained" color="primary">
                Save Changes
            </Button>
        </Stack>
    </Paper>
);

const BillingContent = ({ profile }: { profile: any }) => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
            Billing Details
        </Typography>
        <Typography mb={2}>Current plan: <strong>{profile.stripe_tier}</strong></Typography>
        <Button variant="outlined" onClick={() => {}}>
            Manage Subscription
        </Button>
    </Paper>
);

const SecurityContent = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
            Security Settings
        </Typography>
        <Typography>OAuth is enabled. You can manage account-level security through your provider (Google or GitHub).</Typography>
    </Paper>
);

const ApiContent = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
            API Settings
        </Typography>
        <Typography>API settings are currently disabled.</Typography>
        <Button>Generate API Key</Button>
        <TextField disabled value="APashib2324b3hi23u4bu3i2h3uho2b3_I_KEY" fullWidth />
    </Paper>
);

const MemoryContent = ({ utilityStore }: { utilityStore: any }) => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
            Memory Settings
        </Typography>

        <Typography variant="body1" gutterBottom>Memory settings are currently disabled.</Typography>
        <Alert severity="warning" sx={{ mb: 1 }}>Memory settings and memory hooks are coming soon!</Alert>
        <Alert severity="info" sx={{ mb: 1 }}>Sign up for the newsletter to be notified when memory settings and memory hooks are available!
            <Button variant="outlined" color="primary" sx={{ ml: 2 }} onClick={() => utilityStore.setModal({ open: false })}>
                Sign Up
            </Button>
        </Alert>
        <Divider />

        {/* <Typography variant="h6" gutterBottom>
            Memory Sphere
        </Typography>
        <MemorySphereScene /> */}

        <Button
            onClick={() => utilityStore.setModal({
                open: true,
                content: (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Add Memory Hook
                        </Typography>
                        <FormContainer
                            disableHeader
                            schema={{
                                table: "memory",
                                columns: [
                                    {
                                        dataType: "select",
                                        name: "type",
                                        enumValues: [
                                            { value: "github", label: "Github" },
                                            { value: "email", label: "Email" },
                                            { value: "notion", label: "Notion" },
                                            { value: "slack", label: "Slack" },
                                            { value: "openai", label: "OpenAI" },
                                            { value: "gemini", label: "Gemini" },
                                            { value: "openrouter", label: "OpenRouter" },
                                            { value: "extension", label: "Extension" },
                                            { value: "api", label: "API" },
                                            { value: "webhook", label: "Webhook" },
                                            { value: "code", label: "Snippet" }
                                        ]
                                    }
                                ]
                            }}
                            handleCancelClick={() => utilityStore.setModal({ open: false })}
                            handleSubmit={(values: any) => {
                                console.log(values);
                                alert(`Memory created successfully, ${JSON.stringify(values.value, null, 2)}`);
                                utilityStore.setModal({ open: false, content: null })
                            }}
                        />
                    </>
                )
            })}
        >Add Memory Hook</Button>
        <Divider />
        <ReusableTable
            title="Memory Hooks"
            columns={[
                { name: "Memory", field: "memory" },
                { name: "Type", field: "type" },
                { name: "Agent", field: "agent" },
                { name: "Created At", field: "created_at" },
                { name: "Last Memory At", field: "last_memory_at" },
                { name: "Status", field: "status" },
            ]}
            rows={[
                {
                    memory: "AutoCapture",
                    type: "Extension",
                    agent: "MemoryIndexer",
                    created_at: "2025-06-15",
                    last_memory_at: "2025-06-28",
                    status: "Active"
                },
                {
                    memory: "RepoSync",
                    type: "Github",
                    agent: "RepoAnalyzer",
                    created_at: "2025-06-20",
                    last_memory_at: "2025-06-28",
                    status: "Inactive"
                },
                {
                    memory: "DailyDigest",
                    type: "Email",
                    agent: "BlogGen",
                    created_at: "2025-06-22",
                    last_memory_at: "2025-06-27",
                    status: "Active"
                },
                {
                    memory: "AnalyzeSnippet",
                    type: "Snippet",
                    agent: "Tagger",
                    created_at: "2025-06-25",
                    last_memory_at: "2025-06-26",
                    status: "Active"
                },
                {
                    memory: "Summarize PR",
                    type: "Github",
                    agent: "SummaryBot",
                    created_at: "2025-06-26",
                    last_memory_at: "2025-06-29",
                    status: "Active"
                },
                {
                    memory: "SlackMemoryDrop",
                    type: "Slack",
                    agent: "NotificationAgent",
                    created_at: "2025-06-27",
                    last_memory_at: "2025-06-28",
                    status: "Inactive"
                },
                {
                    memory: "GeminiQA",
                    type: "OpenAI",
                    agent: "GeminiSynth",
                    created_at: "2025-06-28",
                    last_memory_at: "2025-06-29",
                    status: "Active"
                },
                {
                    memory: "TrainBot",
                    type: "Webhook",
                    agent: "Trainer",
                    created_at: "2025-06-28",
                    last_memory_at: "2025-06-28",
                    status: "Inactive"
                },
                {
                    memory: "AgentThoughts",
                    type: "Snippet",
                    agent: "CognitiveLogger",
                    created_at: "2025-06-29",
                    last_memory_at: "2025-06-29",
                    status: "Active"
                }
            ].map((m: any, id: number) => ({ id, ...m }))}
        />
    </Paper>
);

const mockUser = {
    id: "bfe137b2-8413-417f-8cdd-53c2d6142a75",
    aud: "authenticated",
    role: "authenticated",
    email: "youremail@yourdomain.com",
    stripe_tier: "free",
    avatar_url: ""
};

export default function SettingsPage() {
    const utilityStore = useUtilityStore();
    const { session } = useSupabaseStore();
    const setProfile = useMutation(queries.mutate("/api/v1/profile"));

    return (
        <Box 
            p={4} 
            component={motion.div} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
        >
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Settings
            </Typography>
            <Tabs
                tabs={[
                    { label: "Profile" },
                    { label: "Memory" },
                    { label: "Billing" },
                    { label: "Security" },
                    { label: "API" }

                ]}
                variant="scrollable"
                scrollButtons="auto"
                renderContent={(value: number) => ({
                    0: session?.user || mockUser
                        ? <ProfileContent profile={session?.user || mockUser} setProfile={setProfile} />
                        : <>Not logged in</>,
                    1: <MemoryContent utilityStore={utilityStore} />,
                    2: <BillingContent profile={session?.user || mockUser} />,
                    3: <SecurityContent />,
                    4: <ApiContent />
                }[value])}
            />
        </Box>
    )
}
