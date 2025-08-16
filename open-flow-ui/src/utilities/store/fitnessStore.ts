import { create } from "zustand";
// *** APP STORE ***

interface FitnessStoreState {
    userID: string | null;
    isDrawerOpen: boolean;
    activeDrawer: 'food' | 'exercise' | 'weight' | 'profile' | 'sleep' | 'steps';
    drawerAnchor: 'left' | 'right' | 'bottom';
    selectedSearchItem: any; // Replace `any` with the actual type if known
    fitnessTables: Record<string, any>; // Define a more specific type if available
    activeSearchTab: 'recent' | 'favorites' | 'search'
    appConfig: any;
    registrationView: boolean;
    setRegistrationView: (registrationView: boolean) => void;
    setAppConfig: (appConfig: any) => void;
    setFitnessTables: (fitnessTables: Record<string, any>) => void;
    toggleDrawer: (options?: { open?: boolean; anchor?: 'left' | 'right' | 'bottom' } | boolean | null) => void;
    setActiveDrawer: (activeDrawer: string) => void;
    setSelectedSearchItem: (selectedSearchItem: any) => void; // Replace `any` with the actual type if known
    setActiveSearchTab: (activeSearchTab: 'recent' | 'favorites' | 'search') => void;
}

const useFitnessStore = create<FitnessStoreState>((set) => ({
    // states
    userID: null,
    isDrawerOpen: false,
    activeDrawer: "weight",
    drawerAnchor: "right",
    selectedSearchItem: null,
    activeSearchTab: "recent",
    fitnessTables: {},

    registrationView: false,
    setRegistrationView: (registrationView) => set(() => ({ registrationView })),

    appConfig: null,
    setAppConfig: (appConfig) => set(() => ({ appConfig })),

    // actions
    setFitnessTables: (fitnessTables) => set(() => ({ fitnessTables })),
    toggleDrawer: (options) => set((state) => ({
        isDrawerOpen: ((options as any)?.open !== undefined) ? (options as any).open : !state.isDrawerOpen,
        drawerAnchor: ((options as any)?.anchor || state.drawerAnchor)
    })),
    setActiveDrawer: (activeDrawer: any) => set(() => ({ activeDrawer })),
    setSelectedSearchItem: (selectedSearchItem) => set(() => ({ selectedSearchItem })),
    setActiveSearchTab: (activeSearchTab) => set(() => ({ activeSearchTab }))
}));


export { useFitnessStore };
export type { FitnessStoreState }