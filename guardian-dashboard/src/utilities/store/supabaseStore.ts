import { create } from 'zustand';

// *** SUPABASE STORE ***

interface SupabaseUser {
    id: string;
    email: string;
    app_metadata: {
        provider: string;
    };
    user_metadata: {
        name: string;
    };
    role?: string;
}

interface SupabaseSession {
    access_token: string;
    token_type: string;
    user: SupabaseUser;
}

interface SupabaseStore {
    session: SupabaseSession | null;
    userType: "admin" | "guest" | null;
    setUserType: (userType: "admin" | "guest" | null) => void;
    setSession: (session: SupabaseSession | null) => void;
}

const useSupabaseStore = create <SupabaseStore>((set) => ({
    // states
    session: null,
    userType: null,
    // actions
    setSession: (session: any) => set({ session }),
    setUserType: (userType: any) => set({ userType }),
}));

export { useSupabaseStore }
export type { SupabaseStore, SupabaseUser, SupabaseSession }
