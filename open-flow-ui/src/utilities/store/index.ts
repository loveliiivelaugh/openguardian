import { useSupabaseStore, SupabaseStore, SupabaseSession } from "./supabaseStore";
import { useFitnessStore, FitnessStoreState } from "./fitnessStore";
import { useUtilityStore, UtilityStoreType, AlertType, ConfirmType } from "./utilityStore";
import { useAppStore, AppStoreType } from "./appStore";
import { useChatStore, ChatState } from "./chatStore";
import { useCameraStore, CameraStore, useModelStore, ModelStore } from "./cameraStore";
import { useSharedStore, SharedStoreType } from "./sharedStore";
// import { useWorkboxStore } from "./workboxStore";

export { 
    useSupabaseStore, 
    useAppStore, 
    useChatStore, 
    useFitnessStore, 
    useUtilityStore,
    useCameraStore,
    useModelStore,
    useSharedStore,
    // useWorkboxStore
};

export type {
    AlertType,
    ConfirmType,
    UtilityStoreType,
    AppStoreType,
    ChatState,
    CameraStore,
    ModelStore,
    FitnessStoreState,
    SharedStoreType,
    SupabaseStore,
    SupabaseSession
};