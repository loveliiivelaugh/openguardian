import {
    createBrowserRouter,
    RouterProvider,
    Outlet
} from "react-router";
import Providers from "@components/custom/providers/Providers";
import BasicNavbar from '@components/custom/ReusableNavbar/BasicNavbar';
import { Container, Typography, Box } from "@mui/material";
import MemoryOverviewPage from "@components/pages/MemoryOverviewPage";
import SettingsPage, { ProfileContent } from "@components/pages/SettingsPage";
import IntegrationsPage, { IntegrationsGrid, MemoriesPage } from "@components/pages/IntegrationsPage";
// import LoginPage from "@components/Auth/AuthPage";

const routes = [
    {
        label: "Home",
        path: "/",
        element: <IntegrationsPage />
    },
    // {
    //     label: "Login",
    //     path: "/login",
    //     element: <LoginPage />
    // },
    {
        label: "Dashboard",
        path: "/dashboard",
        element: <IntegrationsPage />
    },
    {
        label: "Memory",
        path: "/memory",
        element: <MemoryOverviewPage />
    },
    {
        label: "Single Memory",
        path: "/memory/:id",
        element: <MemoryOverviewPage />
    },
    {
        label: "All Memories",
        path: "/memories",
        element: <MemoriesPage />
    },
    {
        label: "Profile",
        path: "/profile",
        element: <SettingsPage />
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
    // TODO: Visual Automation Canvas coming soon!
    // {
    //     path: "/builder/*",
    //     // element: <AgentFlowEditor />
    //     element: <AgentFlowBuilderDashboard />
    // },
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