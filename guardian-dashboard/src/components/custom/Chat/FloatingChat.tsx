import { Box, Fab  } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import ReusablePopover from "@custom/ReusablePopover/ReusablePopover";
import Chat from "./Chat";
import ChatView from "./ChatView";
import { useChatStore } from "@store/index";


const FloatingChat = (
    props?: 
    { location?: string, tools?: any[], handleCameraClick?: () => void }
) => {
    const chatStore = useChatStore(); // FloatingChat is going to have its own chatStore for now
    return (
        <ReusablePopover
            popoverContent={(_: any, toggle: (open?: boolean) => void) => (
                <Box sx={{ height: 600, width: 400 }}>
                    <ChatView chatStore={chatStore} />
                    {console.log("popoverProps: ", toggle, _, "") as any}
                    <Chat 
                        chatStore={chatStore} 
                        {...props}
                        handleCameraClick={() => Promise
                            .all([
                                toggle(),
                                props?.handleCameraClick
                                    ? props.handleCameraClick()
                                    : () => {},
                                setTimeout(() => toggle(true), 5000)
                            ]
                            .map(async (fn) => await new Promise(resolve => setTimeout(() => resolve(fn), 1000))))
                        }
                    />
                </Box>
            )}
        >
            {(_: any, toggle: () => void) => (
                <Fab color="primary" aria-label="add" onClick={toggle}>
                    <AddIcon />
                </Fab>
            )}
        </ReusablePopover>
    );
};

export default FloatingChat;
