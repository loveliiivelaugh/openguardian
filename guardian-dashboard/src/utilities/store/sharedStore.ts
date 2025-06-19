import { create } from "zustand";


interface SharedStoreType {
    state: any;
    setState: (state: any) => void;
    getState: () => any;
    clearState: () => void;
};

const useSharedStore = create<SharedStoreType>((set) => ({
    state: {},
    setState: (state) => set(state),
    getState: () => ({}),
    clearState: () => set({})
}));

export { useSharedStore };
export default useSharedStore;
export type { SharedStoreType };