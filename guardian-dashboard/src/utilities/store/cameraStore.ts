import { create } from 'zustand'

interface CameraStore {
    appConfig: any
    view: string
    availableDevices: any
    imageSrc: string | null
    imageClassification: any
    classifiedImage: any
    visionMode: string
    websocketClient: null | any,
    videoConstraints: any
    facesDetected: number | null
    problems: string[]
    capturing: boolean
    detectInterval: any
    videoChunks: BlobPart[] | undefined
    attachment: any
    setVideoChunks: (videoChunks: any) => void
    setDetectInterval: (detectInterval: any) => void
    setCapturing: (capturing: boolean) => void
    setVideoConstraints: (videoConstraints: any) => void
    setAvailableDevices: (availableDevices: any) => void
    setClassifiedImage: (classifiedImage: any) => void
    setFacesDetected: (facesDetected: number | null) => void
    handleView: (view: "camera" | "image" | "analysis") => void
    handleImageSrc: (imageSrc: string) => void
    handleImageClassification: (imageClassification: any) => void
    toggleVisionMode: (visionMode: "default" | "documents") => void
    setState: (state: CameraStore) => void,
    setWebsocketClient: (websocketClient: any) => void
    setAppConfig: (appConfig: any) => void
    setProblems: (problems: string[]) => void
    handleAttachment: (attachment: any) => void
};


const defaultVideoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment",
};

const useCameraStore = create<CameraStore>((set) => ({
    appConfig: null,
    view: "analysis",
    imageSrc: null,
    imageClassification: null,
    classifiedImage: null,
    capturing: false,
    visionMode: 'default',
    websocketClient: null,
    facesDetected: null,
    problems: [],
    availableDevices: [],
    videoConstraints: defaultVideoConstraints,
    videoChunks: undefined,
    detectInterval: null,
    attachment: null,
    setDetectInterval: (detectInterval: any) => set(() => ({ detectInterval })),
    setProblems: (problems: string[]) => set(() => ({ problems })),
    setVideoChunks: (videoChunks: any) => set(() => ({ videoChunks })),
    setVideoConstraints: (videoConstraints: any) => set(() => ({ videoConstraints })),
    setAvailableDevices: (availableDevices: any) => set(() => ({ availableDevices })),
    setCapturing: (capturing: boolean) => set(() => ({ capturing })),
    setFacesDetected: (facesDetected: number | null) => set(() => ({ facesDetected })),
    setClassifiedImage: (classifiedImage: any) => set(() => ({ classifiedImage })),
    handleView: (view: "camera" | "image" | "analysis") => set((state: CameraStore) => ({ ...state, view })),  // String ["launching", "chat", "image", "voice"]
    handleImageSrc: (imageSrc: string) => set(() => ({ imageSrc })), // String Base64 image
    handleImageClassification: (imageClassification: any) => set(() => ({ imageClassification })), // Object {}
    toggleVisionMode: (visionMode: "default" | "documents") => set(() => ({ visionMode })), // String ["Default", "Documents", "Receipts"]
    setWebsocketClient: (websocketClient) => set(() => ({ websocketClient })),
    setAppConfig: (appConfig) => set(() => ({ appConfig })),
    handleAttachment: (attachment) => set(() => ({ attachment })),
    // master key function
    setState: (state: CameraStore) => set((prevState: CameraStore) => ({ ...prevState, ...state })),
}));

interface ModelStore {
    ssd: null | any, // Object Detection
    blazeface: null | any, // Facial Recognition
    detector: null | any, // Pose Detection
    estimator: null | any, // Depth Estimation
    mobileNet: null | any, // Image Classification
    setSsd: (ssd: any) => void
    setBlazeface: (blazeface: any) => void,
    setPoseDetector: (detector: any) => void,
    setDepthEstimator: (estimator: any) => void,
    setMobileNet: (mnet: any) => void
}

const useModelStore = create<ModelStore>((set) => ({
    ssd: null,
    blazeface: null,
    detector: null, // poseDetection
    estimator: null,
    mobileNet: null,
    setSsd: (ssd: any) => set(() => ({ ssd })),
    setBlazeface: (blazeface: any) => set(() => ({ blazeface })),
    setPoseDetector: (detector: any) => set(() => ({ detector })),
    setDepthEstimator: (estimator: any) => set(() => ({ estimator })),
    setMobileNet: (mobileNet: any) => set(() => ({ mobileNet })),
}));

// Camera Scripts
const compareLandmarks = (landmarks1: any, landmarks2: any) => {

    if (landmarks2?.probability[0] > 0.5) {

        const isInRange = (value: number) => ((value >= 0.6) && (value <= 1.4));

        const isTopLeftMatch = landmarks1.topLeft.every((value: number, index: number) => isInRange(value / landmarks2.topLeft[index]));
        const isBottomRightMatch = landmarks1.bottomRight.every((value: number, index: number) => isInRange(value / landmarks2.bottomRight[index]));
        const isLandmarksMatch = landmarks1.landmarks.every((landmark1: any, index: number) => landmark1.every((value: number, i: number) => isInRange(value / landmarks2.landmarks[index][i])));

        return (isTopLeftMatch && isBottomRightMatch && isLandmarksMatch);
    }
    else return false
};


export {
    useCameraStore,
    useModelStore,
    compareLandmarks
};

export type {
    CameraStore,
    ModelStore,
};