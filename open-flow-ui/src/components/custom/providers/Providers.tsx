import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { PageTransitionWrapper, ThemeProvider } from '@theme/index';
import Drawer from '@mui2/Drawer/Drawer';
import AlertProvider from './AlertProvider';
import { ConfirmProvider } from './Confirm';
import ModalProvider from './ModalProvider';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
// import { StartupProvider } from './StartProvider';
// import { server } from '@testing/msw/node';

const queryClient = new QueryClient();

const Providers = (
    { children }: 
    { children: (callback?: { data: any }) => React.ReactNode }
) => {
    // server.listen(); //Testing Framework to intercept and mock network requests
    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <ThemeProvider>
                        <PageTransitionWrapper>
                            {children()}
                            <AlertProvider />
                            <ConfirmProvider />
                            <Drawer />
                            <ModalProvider />
                            {/* <StartupProvider /> */}
                        </PageTransitionWrapper>
                    </ThemeProvider>
                </LocalizationProvider>
            </ErrorBoundary>
        </QueryClientProvider>
    )
}

export default Providers
export type Providers = ReturnType<typeof Providers>