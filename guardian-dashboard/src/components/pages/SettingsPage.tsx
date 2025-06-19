import { useState } from 'react'
import Tabs from '@components/Mui/Tabs'
import { 
    Box, Typography, Stack, TextField, Button, 
    Paper, Avatar, Grid, ListItemText, 
    ListItem, ListItemSecondaryAction, Switch 
} from '@mui/material'
import { motion } from 'framer-motion'
import { useMutation, useQuery } from '@tanstack/react-query'
import { IntegrationForm } from '@components/custom/forms/premade/IntegrationForm'
import { useAchievementStore, useSupabaseStore, useUtilityStore } from '@store/index'
import { queries } from '@api/index'
// components/Settings/AchievementsPanel.tsx
import { Card, CardContent } from '@mui/material';
import { Badge } from '@mui/material';


interface Achievement {
    id: string;
    achievement_id: string;
    context: {
        flowId: string;
    };
    title: string;
    description: string;
    key: string;
    created_at: string;
    unlocked_at: string;
    unlocked: boolean;
    rarity: string;
}

export function AchievementsPanel({ achievements, error }: { achievements: Achievement[], error: any }) {
    const achievementsData = useQuery(queries.query(`/database/read_db/achievements`))//?id=${achievements[0].achievement_id}`))
    console.log(achievementsData, achievements)
    if (error) console.error('Error fetching achievements:', error);

    let data: Achievement[] = []
    if (achievements.length > 0 && achievementsData?.data) {
        data = achievementsData?.data?.data
            .filter(({ id }: { id: string }) => (achievements.some(({ achievement_id }: Achievement) => achievement_id === id)))
            .map((item: any) => ({
                // @ts-ignore
                id: item.achievement_id,
                ...achievements[0],
                ...item,
            }));
    }

    return (
        <Grid container spacing={3}>
            <Grid size={12} mt={2} spacing={2}>
                <Typography variant="h3" color="text.secondary">Achievements</Typography>
                {data.length > 0 ? (
                    data.map((achieve: Achievement) => (
                        <div
                            style={{
                                position: 'relative',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                padding: '2px', // important for visible border gap
                            }}
                            >
                        <motion.div
                            key={achieve.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                // @ts-ignore
                                border: `1px solid rgba(255,255,255,0.6)`,
                                // borderRadius: '16px',
                                borderRadius: '14px', // slightly smaller for inner content
                                background: '#0e0e0e', // whatever your card bg is
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            <Card>
                                <CardContent sx={{ p: 2 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="h5">{achieve.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">{achieve.description}</Typography>
                                            <Typography variant="body2" color="text.secondary">Rarity: {achieve.rarity}</Typography>
                                            <Typography variant="body2" color="text.secondary">{achieve.unlocked_at}</Typography>
                                        </Box>
                                        {/* @ts-ignore */}
                                        <Badge variant="outline">🏆</Badge>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <div
                            style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(270deg, #ff00c8, #00fff0, #fffb00, #ff00c8)',
                            backgroundSize: '600% 600%',
                            borderRadius: '16px',
                            zIndex: 0,
                            animation: 'rainbowBorder 8s ease infinite',
                            pointerEvents: 'none', // don't block clicks
                            }}
                        />
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground">No achievements unlocked yet. Keep building!</p>
                )}
            </Grid>
            <Grid size={12} mt={2}>
                <Typography variant="h3" color="text.secondary">Locked Achievements</Typography>
                <Grid container spacing={2}>
                    {achievementsData?.data?.data?.length > 0 ? (
                        achievementsData?.data?.data?.map((achieve: any) => (
                            <Grid size={4} key={achieve.id}>
                                <motion.div
                                    key={achieve.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        // @ts-ignore
                                        border: `1px solid ${({
                                            common: 'rgba(32, 174, 0, 0.52)',
                                            uncommon: 'rgba(8, 151, 223, 0.72)',
                                            rare: 'rgba(157, 5, 199, 0.51)',
                                            epic: 'rgba(171, 23, 23, 0.64)',
                                            legendary: 'rgba(231, 231, 3, 0.79)',
                                        }[achieve.rarity as any])}`,
                                        borderRadius: '16px'
                                    }}
                                >
                                    <Card className={achieve.unlocked ? '' : 'opacity-50'}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold">{achieve.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{achieve.description}</p>
                                                </div>
                                                <Badge variant={achieve.unlocked ? 'standard' : 'dot'}>
                                                    {achieve.unlocked ? '🏆 Unlocked' : '🔒 Locked'}
                                                </Badge>
                                                <Typography variant="h6" color="text.secondary">{achieve.rarity}</Typography>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))
                    ) : (
                        <p className="text-muted-foreground">Loading achievements...</p>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
}

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

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
                InputProps={{ readOnly: true }}
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
                InputProps={{ readOnly: true }}
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
                InputProps={{ readOnly: true }}
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

const BillingContent = ({ profile, handleStripePortal }: { profile: any, handleStripePortal: () => void }) => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
            Billing Details
        </Typography>
        <Typography mb={2}>Current plan: <strong>{profile.stripe_tier}</strong></Typography>
        <Button variant="outlined" onClick={handleStripePortal}>
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

const IntegrationsContent = (
    { isEnabled, setIsEnabled, handleIntegrationForm }:
        { isEnabled: boolean, setIsEnabled: (value: boolean) => void, handleIntegrationForm: (integration: string) => void }
) => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
            Integrations
        </Typography>
        <Typography gutterBottom>{isEnabled ? 'Integrations are currently enabled.' : 'Integrations are currently disabled.'}</Typography>
        <Stack spacing={2} mt={2}>
            <Button variant="contained" color="primary" fullWidth onClick={() => setIsEnabled(!isEnabled)}>
                {isEnabled ? 'Disable Integrations' : 'Enable Integrations'}
            </Button>
            <Button variant="outlined" disabled={!isEnabled} color="primary" fullWidth onClick={() => handleIntegrationForm("github")}>
                Github
            </Button>
            <Button variant="outlined" disabled={!isEnabled} color="primary" fullWidth onClick={() => handleIntegrationForm("email")}>
                Email
            </Button>
            <Button variant="outlined" disabled={!isEnabled} color="primary" fullWidth onClick={() => handleIntegrationForm("notion")}>
                Notion
            </Button>
            <Button variant="outlined" disabled={!isEnabled} color="primary" fullWidth onClick={() => handleIntegrationForm("slack")}>
                Slack
            </Button>
            <Button variant="outlined" disabled={!isEnabled} color="primary" fullWidth onClick={() => handleIntegrationForm("openai")}>
                OpenAI
            </Button>
            <Button variant="outlined" disabled={!isEnabled} color="primary" fullWidth onClick={() => handleIntegrationForm("gemini")}>
                Gemini
            </Button>
            <Button variant="outlined" disabled={!isEnabled} color="primary" fullWidth onClick={() => handleIntegrationForm("openrouter")}>
                OpenRouter
            </Button>
        </Stack>
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

const mockUser = {
    id: "bfe137b2-8413-417f-8cdd-53c2d6142a75",
    aud: "authenticated",
    role: "authenticated",
    email: "michael1@woodardwebdev.com",
    stripe_tier: "free", // TODO: modify user_profiles table to include stripe_tier
    avatar_url: "https://lh3.googleusercontent.com/a/ACg8ocKF2OHceq568vKSLiy8Ou7slkuuCoVeQA2TW0xl57Uc8TA2sg=s96-c"
};

export default function SettingsPage() {
    const { data: achievements, error } = useQuery(queries.query("/database/read_db/unlocked_achievements"))
    const achievementsStore = useAchievementStore();
    console.log("achievements: ", achievementsStore, achievements);
    const utilityStore = useUtilityStore();
    const { session } = useSupabaseStore();
    const setProfile = useMutation(queries.mutate("/api/v1/profile"));

    const [isEnabled, setIsEnabled] = useState(false);

    const handleStripePortal = async () => { }
    const handleIntegrationForm = async (integration: string) => {
        if (integration === "github") {
            window.open("https://github.com/login/oauth/authorize?client_id=" + import.meta.env.VITE_GITHUB_CLIENT_ID + "&redirect_uri=" + "http://localhost:5173/auth/callback" + "/auth/callback/github", "_blank");
            return;
        }
        utilityStore.setModal({
            open: true,
            content: <IntegrationForm userId={(session?.user?.id || mockUser.id) as string} />
        })
    }

    return (
        <Box p={4} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Settings
            </Typography>

            <Tabs
                tabs={[
                    { label: "Profile" },
                    // { label: "Achievements" },
                    { label: "Billing" },
                    { label: "Integrations" },
                    { label: "Security" },
                    { label: "API" }

                ]}
                variant="scrollable"
                scrollButtons="auto"
                onChange={(newValue: number | string) => {/* handle change logic here */ }}
                renderContent={(value: number) => ({
                    0: session?.user || mockUser
                        ? <ProfileContent profile={session?.user || mockUser} setProfile={setProfile} />
                        : <>Not logged in</>,
                    // 1: <AchievementsPanel achievements={achievements?.data} error={error} />,
                    1: <BillingContent profile={session?.user || mockUser} handleStripePortal={handleStripePortal} />,
                    2: <IntegrationsContent isEnabled={isEnabled} setIsEnabled={setIsEnabled} handleIntegrationForm={handleIntegrationForm} />,
                    3: <SecurityContent />,
                    4: <ApiContent />
                }[value])}
            />
        </Box>
    )
}
