import {
    createBrowserRouter,
    RouterProvider,
    Outlet
} from "react-router";
import { useEffect, useState, useMemo } from "react";
import { Container, Button, Grid } from "@mui/material";
import Providers from "@components/custom/providers/Providers";
import BasicNavbar from '@components/custom/ReusableNavbar/BasicNavbar';
import { Typography, TextField, Paper, Box } from "@mui/material";
import Chat from "../Chat/Chat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Fuse from 'fuse.js';
import { client, queries } from "@api/index";
import { useChatStore } from "@store/index";
import { MessageCard } from "../MessageCard/MessageCard";
import BasicSimpleTreeView from "../TreeView/TreeView";
import MemoryCard from "../MemoryList";
import MemoryOverviewPage from "@components/pages/MemoryOverviewPage";
import { FilterToggleGroup } from "../FilterToggleGroup";
import MemorySphereScene from "../MemorySphere5";
import SettingsPage, { ProfileContent } from "@components/pages/SettingsPage";
import IntegrationsPage, { IntegrationButtons, IntegrationsGrid } from "@components/pages/IntegrationsPage";
import LoginPage from "@components/Auth/AuthPage";
import { AuthGate } from "@components/Auth/AuthGate.gen";
import AgentFlowBuilderDashboard from "@components/pages/AgentFlowBuilder/AgentFlowBuilderContainer";

// const useProfileData = () => {
//     const profileQuery = useQuery(queries.query("/api/v1/guardian/profile-context"))
//     console.log("profileQuery: ", profileQuery)
//     return {}
// }

type Memory = {
    id: string;
    title: string;
    payload: {
        content: string;
        summary?: string;
        tags?: string[];
    };
    type: string;
    agent: string;
    created_at: string;
};


const guardianPlaygroundConversationId = "";
const HomePage = () => {
    // const profileData = useProfileData();
    const chatStore = useChatStore();
    const guardianMessagesQuery = useQuery(queries.query("database/local/read_db/messages?conversation_id=" + guardianPlaygroundConversationId))
    const memoriesData = useQuery(queries.query("/database/read_db/memories"))
    const memories = memoriesData.data?.data || [];

    console.log("memoriesData: ", memoriesData)
    const guardianFilesQuery = useQuery(queries.query("/api/v1/aichat/guardian-playground-files"))
    const chatMutation = useMutation(queries.mutate("/api/v1/aichat/guardian-chat"));
    const response = chatMutation?.data?.data?.text;
    const [chatMessages, setChatMessages] = useState<any[]>([]);

    const guardianFiles = guardianFilesQuery.data?.data || [];

    // useEffect(() => {
    //     (async () => {
    //         const code = new URLSearchParams(window.location.search).get("code");
    //         console.log("code: ", code)
    
    //         if (code && window.location.search.includes('github')) {
    //             const encryptedCode = await encrypt(code, import.meta.env.VITE_MASTER_API_KEY);
    //             const metadata = {};
    //             const payload = {
    //                 user_id: import.meta.env.VITE_ADMIN_ID,
    //                 service: 'github',
    //                 access_token: encryptedCode.ciphertext,
    //                 access_token_iv: encryptedCode.iv,
    //                 ...metadata
    //             }
    //             const result = await client.post('/database/write_db/user_integrations', payload)
    //         };
    //     })();
    // }, [])

    const [query, setQuery] = useState('');
    const [relatedMemories, setRelatedMemories] = useState<Memory[]>([]);

    const fetchRelatedMemories = async (input: string) => {
        try {
            const res = await client.post("/api/v1/memory/query", {
                query: input
            })

            const data = await res.data;
            setRelatedMemories(data?.memories || []);
        } catch (error) {
            console.error('Error fetching related memories:', error);
        }
    };

    const handleSelectMemory = async (memory: Memory) => {
        const searchText = memory.title || memory.payload.summary || memory.payload.content.slice(0, 80);
        setQuery(searchText);
        fetchRelatedMemories(searchText);
    };

    const fuse = useMemo(() => {
        return new Fuse(memories, {
        keys: ['title', 'payload.content', 'payload.summary', 'payload.tags'],
        threshold: 0.3,
        });
    }, [memories]);

    useEffect(() => {
        if (query.trim() === '') {
            setRelatedMemories([]);
        } else {
            const results = fuse.search(query);
            setRelatedMemories(results.map((r: any) => r.item));
        }
    }, [query, fuse]);

    console.log("chatMutation: ", chatMutation, guardianMessagesQuery, chatMessages, guardianFilesQuery)

    // useEffect(() => {
    //     const fetchInitialMessages = async () => {
    //         const { data } = await supabase
    //             .from('messages')
    //             .select('*')
    //             .order('created_at', { ascending: false })
    //             .limit(50);
    //         if (data) setChatMessages(data);
    //     };

    //     fetchInitialMessages();

    //     const channel = supabase
    //         .channel('messages')
    //         .on(
    //             'postgres_changes',
    //             { event: 'INSERT', schema: 'public', table: 'messages' },
    //             (payload: any) => {
    //                 // @ts-ignore
    //                 setChatMessages((prev: any) => [...prev, payload.new]);
    //                 // setChatMessages((prev: any) => [payload.new, ...prev.slice(0, 49)]);
    //             }
    //         )
    //         .subscribe();

    //     return () => {
    //         supabase.removeChannel(channel);
    //     };
    // }, []);

    return (
        <>
            <Grid size={12} sx={{ height: "50vh", zIndex: -100 }}>
                <MemorySphereScene />
            </Grid>

            <Grid container spacing={2}>
                <Grid size={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="🔍 Search memories..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') fetchRelatedMemories(query);
                        }}
                    />
                </Grid>

                <FilterToggleGroup value={relatedMemories.map((m: any) => m.title)[0]} onChange={(value) => console.log(value)} />
                Memory Console
                <Grid size={8} sx={{ 
                    backgroundColor: "rgba(22, 22, 22, 0.8)", 
                    p: 2,
                    borderRadius: 4,
                    overflowY: "scroll",
                    maxHeight: "calc(100vh - 200px)",
                    zIndex: 10
                }}>
                    {memories.map((memory: any) => (
                        <motion.div
                            key={memory.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => handleSelectMemory(memory)}
                        >
                            <MemoryCard memory={memory} />
                        </motion.div>
                    ))}
                </Grid>

                <Grid size={4}>
                    <SettingsPage />
                    <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            🔗 Related Memories
                        </Typography>

                        {query && relatedMemories.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                No results found for <strong>{query}</strong>.
                            </Typography>
                        ) : (
                            relatedMemories.map((memory) => (
                                <Paper
                                    key={memory.id}
                                    variant="outlined"
                                    sx={{ p: 2, mb: 2, backgroundColor: 'background.default' }}
                                >
                                    <Typography variant="subtitle2" gutterBottom>
                                        {memory.title || 'Untitled'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {memory.payload.summary || memory.payload.content.slice(0, 100) + '...'}
                                    </Typography>
                                </Paper>
                            ))
                        )}
                    </Box>
                </Grid>
            </Grid>
            <Typography variant="h3" fontWeight={200}>Woodward-Studio Guardian Playground</Typography>
            <Grid size={2}>
                <BasicSimpleTreeView 
                    menu={guardianFiles} 
                    onClick={(item) => console.log(item)}
                />
            </Grid>


            <Grid size={8}>
                {/* <ChatView chatStore={chatStore} /> */}
                <Box sx={{ maxHeight: "70vh", overflowY: "scroll", mt: 2 }}>
                    {chatMessages
                        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                        .map((msg) => (
                            <MessageCard key={msg.id} msg={msg} />
                        ))}
                </Box>
            </Grid>
            <Grid size={12}>
                {/* {JSON.stringify(chatMessages, null, 2)} */}
                <Button>Templates</Button>
                <Button>Settings</Button>
                <Box sx={{ width: "100%" }}>
                    <Chat 
                        onSubmit={() => {
                            console.log("values: ", chatStore.inputMessage)
                            chatMutation.mutate({
                                    conversationId: guardianPlaygroundConversationId,
                                    prompt: chatStore.inputMessage
                                }, {
                                    onSuccess: (data) => {
                                        console.log("SUCCESS! data: ", data)
                                    }
                                }
                            )
                        }}
                    />
                </Box>
                {/* <Typography variant="h5" fontWeight={200}>Response: {response}</Typography> */}
            </Grid>
        </>
    )
}

const routes = [
    {
        label: "Home",
        path: "/",
        element: <LoginPage />
    },
    {
        label: "Login",
        path: "/login",
        element: <LoginPage />
    },
    {
        label: "Dashboard",
        path: "/dashboard",
        element: <IntegrationsPage />
    },
    {
        label: "Explorer",
        path: "/explorer",
        element: <HomePage />
    },
    {
        label: "Memory",
        path: "/memory",
        element: <MemoryOverviewPage />
    },
    {
        label: "Memory/:id",
        path: "/memory/:id",
        element: <MemoryOverviewPage />
    },
    {
        label: "Integrations",
        path: "/integrations",
        element: (
            <>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Connect your tools
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Connect your tools to Memory.me to automatically save your memories from other apps.
                    </Typography>
                </Box>
                <IntegrationsGrid />
                {/* <IntegrationButtons /> */}
            </>
        )
    },
    {
        path: "/builder/*",
        // element: <AgentFlowEditor />
        element: <AgentFlowBuilderDashboard />
    },
    {
        label: "Settings",
        path: "/settings",
        element: <ProfileContent profile={{
            id: "1",
            name: "Michael Woodward",
            email: "michael@woodward-studio.com",
            avatar_url: "https://i.pravatar.cc/150?u=1",
            stripe_tier: "free"
        }} setProfile={() => {}} />
    },
    {
        label: "Auth Callback",
        path: "/auth/callback/:service",
        element: <IntegrationsPage />
    }
];

// Layout.tsx
export default function Layout() {
    return (
        <Providers>
            {() => (
                    <main>
                        <BasicNavbar />
                        {/* <AuthGate>
                            <>Logged In 🧙🏼‍♂️✨🎉</>
                        </AuthGate> */}
                        <Container maxWidth={false} sx={{ mt: 10 }}>
                            <Outlet />
                        </Container>
                    </main>
            )}
        </Providers>
    );
};


export function AppRouter() {
    const appRoutes = [
        {
            path: "/",
            id: "root",
            element: (<Layout />),
            children: routes
        }
    ];
    const appRouter = createBrowserRouter(appRoutes);
    return <RouterProvider router={appRouter} />;
};