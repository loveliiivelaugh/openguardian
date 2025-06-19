import { create } from 'zustand';

interface AlertType {
    severity: string; //"success" | "error" | "warning" | "info";
    message: string;
    open: boolean;
};

interface ConfirmType {
    open: boolean;
    title?: string;
    message?: string;
    severity?: string; //"success" | "error" | "warning" | "info";
    continueText?: string;
    cancelText?: string;
    onConfirm?: (
        answer: boolean,
        resolve?: (value: boolean | PromiseLike<boolean>) => void) => void | Promise<void>;
    onCancel?: (answer: boolean) => void;
};

interface DrawerType {
    children?: any
    anchor?: string; //"left" | "right" | "top" | "bottom"
    open?: boolean
    content?: any
    variant?: string; //"permanent" | "persistent" | "temporary"
    onOpen?: (cb: () => void) => void
    onClose?: (cb: () => void) => void
};

interface ErrorType {
    name?: string;
    category?: string;
    message?: string;
    location?: string;
};

interface ModalType {
    open?: boolean;
    content?: any;
    title?: string;
    sx?: any;
    onOpen?: (cb: () => void) => void;
    onClose?: (cb: () => void) => void;
};

interface UtilityStoreType {
    
    confirm: ConfirmType
    setConfirm: (confirm: UtilityStoreType["confirm"]) => void;
    clearConfirm: () => void;
    
    colorMode: string; //"light" | "dark";
    setColorMode: (colorMode: UtilityStoreType["colorMode"]) => void;
    
    alert: AlertType
    setAlert: (alert: UtilityStoreType["alert"]) => void;
    createAlert: (severity: string, message: string) => void;

    drawer: DrawerType
    setDrawer: (drawer: DrawerType) => void;

    modal: ModalType
    setModal: (modal: ModalType) => void;

    errors: ErrorType[];
    setErrors: (error: ErrorType) => void;
};

const useUtilityStore = create<UtilityStoreType>((set) => ({
    alert: {
        severity: "success",
        message: "",
        open: false
    },
    confirm: {
        open: false,
        title: "",
        message: "",
    },
    drawer: {
        open: false,
        content: null,
        anchor: "left"
    },
    modal: {
        open: false,
        title: "",
        content: null,
        sx: {}
    },
    colorMode: "dark",
    errors: [],
    setModal: (modal) => set((old) => ({ modal: !modal.open
        ? {
            // default: IF modal is closed. set to initial/ clear previous
            open: false,
            title: "",
            content: null,
            sx: {}
        }
        : { ...old.modal, ...modal }
    })),
    setDrawer: (drawer) => set((old) => ({ drawer: { ...old.drawer, ...drawer } })),
    setConfirm: (confirm) => set((old) => ({ confirm: { ...old.confirm, ...confirm }})),
    clearConfirm: () => set(() => ({ confirm: { open: false, title: "", message: "" } })),
    setColorMode: (colorMode) => set(() => ({ colorMode })),
    setAlert: (alert) => set(() => ({ alert })),
    createAlert: (severity: string, message: string) => set(() => ({ alert: { severity, message, open: true } }) as UtilityStoreType),
    setErrors: (error) => set((old) => ({ errors: [...old.errors, error] }))
}));

export default useUtilityStore;
export { useUtilityStore }
export type { UtilityStoreType, AlertType, ConfirmType, DrawerType };
