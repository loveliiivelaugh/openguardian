import { create } from "zustand";


interface ChatState {
  messages: any[];
  view: string;
  mode: string;
  imageSrc: string | string[] | null;
  imageClassification: string | null;
  drawerOpen: boolean;
  activeChat: any | null;
  activeChatId: string | null;
  visionMode: string;
  defaultModel: string;
  defaultVisionModel: string;
  selectedOptionsTab: number;
  drawerView: string;
  chatStatus: string | null;
  inputMessage: string;
  mutationOptions: {
    method: string;
    endpoint: string;
    table: string;
  };
  toolsWindowDrawer: boolean;
  isInternetQuery: boolean;
  chatMode: '/create' | '/chat' | '/imagine' | '/internet',
  chatModes: string[],
  appContent: any | null;
  appConfig: any | null;
  cpxData: any | null;
  attachment: string | null;

  // handlers
  setAppContent: (appContent: any) => void;
  setCpxData: (cpxData: any) => void;
  setIsInternetQuery: (isInternetQuery: boolean) => void;
  setToolsWindowDrawer: (toolsWindowDrawer: boolean) => void;
  setMutationOptions: (mutationOptions: { method: string; endpoint: string; table: string }) => void;
  handleInput: (inputMessage: string) => void;
  addMessage: (message: any) => void;
  setMessages: (messages: any[]) => void;
  handleView: (view: string) => void;
  handleMode: (mode: string) => void;
  handleImageSrc: (imageSrc: string | string[] | null) => void;
  handleImageClassification: (imageClassification: string | null) => void;
  handleDrawer: (open: boolean) => void;
  handleActiveChat: (chat: any) => void;
  handleActiveChatId: (chatId: string) => void;
  handleAttachment: (attachment: string) => void;
  toggleVisionMode: (visionMode: string) => void;
  setDrawerView: (drawerView: string) => void;
  setDefaultModel: (defaultModel: string) => void;
  setDefaultVisionModel: (defaultVisionModel: string) => void;
  handleSelectedOptionsTab: (value: number) => void;
  updateChatStatus: (status: string) => void;
  clearChat: () => void;
  setAppConfig: (appConfig: any) => void;
  setState: (state: any) => void;
}

const useChatStore = create<ChatState>((set) => ({
    messages: [],
    view: "chat",
    chatMode: '/chat',
    chatModes: ['/create', '/chat', '/imagine', '/internet'],
    mode: "chat", // I think can be deprecated: image and voice are handled by new microservices
    imageSrc: null,
    imageClassification: null, // " ^^ "
    drawerOpen: false,
    activeChat: null,
    activeChatId: null,
    visionMode: 'default',  // " ^^ "
    defaultModel: 'gemma2:latest',
    defaultVisionModel: 'llama3.2-vision:latest',
    selectedOptionsTab: 0,
    drawerView: "read", // options: ['read', 'add']
    chatStatus: null,
    inputMessage: "",
    mutationOptions: {
      method: 'post', // ['post', 'get', 'put', 'delete']
      endpoint: 'create_row', // ['create_row', 'update_row', 'delete_row']
      table: 'chats' // ['blogs', 'inventory', 'models', 'chats']
    },
    toolsWindowDrawer: false,
    isInternetQuery: false,
    appContent: null,
    appConfig: null,
    cpxData: null,
    attachment: null,
    
    // handlers
    // ** setAppConfig: sets the appConfig state **
    // * @params {any} appConfig - the new appConfig object
    // * @returns {void}
    // */
    setAppConfig: (appConfig: any) => set(() => ({ appConfig })),
    // ** setAppContent: sets the appContent state **
    // * @params {any} appContent - the new appContent object
    // * @returns {void}
    // */
    setAppContent: (appContent: any) => set(() => ({ appContent })),
    setCpxData: (cpxData: any) => set(() => ({ cpxData })),
    setIsInternetQuery: (isInternetQuery) => set(() => ({ isInternetQuery })),
    setToolsWindowDrawer: (toolsWindowDrawer) => set(() => ({ toolsWindowDrawer })),
    setMutationOptions : (mutationOptions) => set(() => ({ mutationOptions })), // { method, endpoint, table }
    // ** handleInput: sets the inputMessage state **
    // * @params {string} inputMessage - the new inputMessage string
    // * @returns {void}
    // */
    handleInput: (inputMessage) => set(() => ({ inputMessage })), // String
    // ** addMessage: Adds a message to the messages array **
    // * @params {object} message - the new message object
    // * @returns {void}
    // */
    addMessage: (message) => set((prev) => ({ messages: [...prev.messages, message] })), // Object
    // ** setMessages: Sets the messages array **
    // * @params {array} messages - the new messages array
    // * @returns {void}
    // */
    setMessages: (messages) => set(() => ({ messages })), // Array of Objects
    // ** handleView: Sets the view state **
    // * @params {string} view - the new view string
    // * @returns {void}
    // */
    handleView: (view) => set(() => ({ view })), // String ["launching", "chat", "image", "voice"]
    // ** handleMode: Sets the mode state **
    // * @params {string} mode - the new mode string. Can be one of ["chat", "create", "imagine"]
    // * @returns {void}
    // */
    handleMode: (mode) => set(() => ({ mode })), // String: ["chat", "create", "imagine"]
    // ** handleImageSrc: Sets the imageSrc state **
    // * @description - sets the imageSrc state. Can handle multiple images
    // * @params {string} imageSrc - the new imageSrc string
    // * @returns {void}
    // */
    handleImageSrc: (imageSrc) => set((prevState) => (prevState.imageSrc)
      ? ({ imageSrc: Array.isArray(prevState.imageSrc) ? [...prevState.imageSrc, imageSrc] : [prevState.imageSrc, imageSrc] })
      : ({ imageSrc }) as any
    ), // String Base64 image
    // ** handleImageClassification: Sets the imageClassification state **
    // * @params {string} imageClassification - the new imageClassification string
    // * @returns {void}
    // */
    handleImageClassification: (imageClassification) => set(() => ({ imageClassification })), // Object {}
    // ** handleDrawer: Sets the drawerOpen state **
    // * @params {boolean} drawerOpen - the new drawerOpen boolean
    // * @returns {void}
    // */
    handleDrawer: (drawerOpen) => set(() => ({ drawerOpen })), // Boolean
    setDrawerView: (drawerView) => set(() => ({ drawerView })), // String: ['read', 'add']
    handleActiveChat: (activeChat) => set(() => ({ activeChat })), // Object
    handleActiveChatId: (activeChatId) => set(() => ({ activeChatId })), // String
    handleAttachment: (attachment) => set(() => ({ attachment })), // String
    toggleVisionMode: (visionMode) => set(() => ({ visionMode })), // String ["Default", "Documents", "Receipts"]
    setDefaultModel: (defaultModel) => set(() => ({ defaultModel, drawerOpen: false, selectedOptionsTab: 0 })), // String: defaultModel
    setDefaultVisionModel: (defaultVisionModel) => set(() => ({ defaultVisionModel })),
    handleSelectedOptionsTab: (selectedOptionsTab) => set(() => ({ selectedOptionsTab })), // Number
    updateChatStatus: (chatStatus) => set(() => ({ chatStatus })), // String
    clearChat: () => set(() => ({ messages: [] })), // Fn
    clearInput: () => set(() => ({ inputMessage: "" })), // Fn

    setState: (state: any) => set((prevState) => ({ ...prevState, ...state })),
  }));
  
export default useChatStore;
export { useChatStore };
export type { ChatState };
  