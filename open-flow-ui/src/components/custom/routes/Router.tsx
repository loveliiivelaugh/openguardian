import {
    createBrowserRouter,
    RouterProvider,
    Outlet
} from "react-router";
import { Container } from "@mui/material";
import Providers from "@components/custom/providers/Providers";
import BasicNavbar from '@components/custom/ReusableNavbar/BasicNavbar';
import { Box } from "@mui/material";
import AgentFlowCanvas from "@components/pages/AgentFlow";

const routes = [
    {
        label: "Home",
        path: "/",
        element: (
                <AgentFlowCanvas />
            // <Box sx={{ position: 'absolute', width: '100vw', height: '100vh', overflow: 'hidden'}}>
            // </Box>
        )
    }
];

// Layout.tsx
export default function Layout() {
    return (
        <Providers>
            {() => (
                <main>
                    {/* <BasicNavbar /> */}
                    <Container>
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