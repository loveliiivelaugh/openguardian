import { 
    IconButton, InputAdornment,
    Box, TextField, 
    CircularProgress
} from '@mui/material'
import {
    Send as SendIcon,
} from '@mui/icons-material';
import { useRef } from 'react';
import { useForm } from '@tanstack/react-form';
import { useChatStore } from '@store/index'
import { chatScripts } from './chatHelper';
import { paths } from '@api/index';
import type { ChatState } from '@store/index'

const Chat = (props: any) => {
    const chatStore = useChatStore();
    // Plug in the passed in store if there is one
    let chat: ChatState = props?.chatStore
        ? props.chatStore
        : chatStore;

    const ref: any = useRef(null);

    const handleSubmit = (event?: any) => {
        event?.preventDefault();
        props.onSubmit(); // check chatStore for values
    };

    const defaultValues = Object.assign({}, ...[]);
    const form = useForm({ defaultValues, onSubmit: handleSubmit, validators: {} });

    return (
        // @ts-ignore
        <Box component={form.Form} sx={{ position: 'sticky', bottom: 0, left: 0, right: 0, backdropFilter: 'blur(8px)' }}>
            <TextField
                id="multiline-input"
                ref={ref.current}
                variant="outlined"
                fullWidth
                autoFocus
                placeholder={
                    // Tell AgentFlow what you need and sit back to enjoy the show. Feel free to interupt or adjust things as needed. 
                    "Guardian Playground ready for experiments."
                }
                value={chat.inputMessage}
                onChange={(e) => chat.handleInput(e.target.value)}
                sx={{ overflow: 'auto', borderRadius: 0 }} 
                multiline
                maxRows={4}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                sx={theme => ({ color: theme.palette.primary.main })}
                                aria-label="send"
                                color="inherit"
                                type="submit"
                                onClick={handleSubmit}
                                size="small"
                            >
                                {props?.isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                            </IconButton>
                        </InputAdornment>
                    ),
                    sx: theme => ({ 
                        backgroundColor: theme.palette.background.default,
                        ".MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main
                        }
                    }),
                }}
            />
        </Box>
    )
}

export default Chat