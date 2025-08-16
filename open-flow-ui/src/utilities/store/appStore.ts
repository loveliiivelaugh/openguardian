import { create } from "zustand";

interface ViewType {
    title: string;
};
interface AppStoreType {
    view: ViewType;
    queries: any;
    setView: (view: AppStoreType["view"]) => void;
    setQueries: (queries: any) => void;
};

const useAppStore = create<AppStoreType>((set) => ({
    view: {
        title: "Woodward-Blog",
        id: ""
    },
    queries: {},
    setView: (view) => set(() => ({ view })),
    setQueries: (queries: any) => set(() => ({ queries }))
}));

export { useAppStore }
export type { AppStoreType, ViewType }