import { client, paths } from "@api/index";


interface MessageResult {
    message?: string
    model?: string
    image?: string
    response?: string
}

// **
// * getMetaData: Adds default metadata to the message
// * @constructor
// * @param chatStore
// * @returns
// * {
// *   model: chatStore.defaultModel | "llama3.1:latest",
// *   session_id: chatStore.activeChat.session_id,
// *   date: new Date().toLocaleDateString(),
// *   time: new Date().toLocaleTimeString()
// * }
// */
const getMetaData = (chatStore: any) => ({
    model: chatStore.defaultModel,
    session_id: chatStore.activeChat?.session_id,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
});

const chatScripts = {

    // ** handleSendMessage: Sends message to the backend
    // * @description - Main function that handles posting a message to the backend, can pass in a path to submit the request to. Can also pass in an onSuccess handler that will return the success data back out of the <Chat /> component.
    // * @constructor
    // * @param {ChatStore} chatStore - Chat store
    // * @param {function} serverMutation - POST request function ** deprecated
    // * @param {any} args - Additional arguments *if any needed*
    // * @returns
    // */
    handleSendMessage: async (
        { chatStore, serverMutation, ...args }:
        { chatStore: any, serverMutation: any, [key: string]: any }
    ) => {
        const { inputMessage } = chatStore;

        console.log('handleSendMessage.input: ', inputMessage)
        if (inputMessage.trim() !== '') {
            if (chatStore.chatModes.includes(inputMessage)) {
                chatStore.handleMode(inputMessage.split('/')[1] || 'chat');
                chatStore.handleInput(""); // clear the chat
            }
            else {
                const message = {
                    ...getMetaData(chatStore),
                    text: inputMessage, 
                    sender: 'user',
                    // if image is present, it will be handled in the backend
                    ...chatStore?.imageSrc && { 
                        imageSrc: chatStore.imageSrc,
                        model: (chatStore.defaultVisionModel || 'llava:7b-v1.6')
                    } // supports attachments/uploads
                };

                // Add user's message to the chat state
                chatStore.addMessage(message);
                chatStore.handleInput(""); // clear the chat

                // Send the current message and conversation id
                // the backend will query the running messages
                const url = args?.submitPath ? args.submitPath(paths) : (paths as any).postChat;
                const response = await client.post(url, {
                    chatMode: chatStore.mode,
                    id: chatStore.activeChat.id,
                    message
                });

                // Define success handler callback -- Add response message to store
                const handleSuccess = (result: MessageResult) => chatStore
                    .addMessage({
                        ...getMetaData(chatStore),
                        sender: 'bot',
                        text: typeof result === "string" ? result : result?.response,
                        model: result?.model,
                        ...result?.image && { imageSrc: result.image }
                    });

                if (response.status === 200) {
                    handleSuccess(response.data);
                    args?.onSuccess && args.onSuccess(response.data, chatStore.messages);
                };
            };

            // // auto-scroll the container to the bottom
            // scrollChatToBottom();
        };
        // Clear the input
        chatStore.handleInput(""); // clear the chat
        chatStore.handleImageSrc(null);
    },

    // ** handleSendPicture: Sends image to the backend
    // * @description
    // * @constructor
    // * @param {ChatStore} chatStore - Chat store
    // * @param {function} serverMutation - POST request function
    // * @returns
    // */
    handleSendPicture: async (
        { chatStore, serverMutation }:
        { chatStore: any, serverMutation: any }
    ) => {
        console.log("chatScripts.handleSendPicture.first: ", chatStore)
        const { imageSrc, inputMessage } = chatStore;
        if (imageSrc) {
            // Add user's message to the chat
            chatStore.addMessage({
                ...getMetaData(chatStore),
                text: inputMessage, 
                imageSrc, 
                sender: 'user' 
            });
            
            // Define success handler callback -- Add response message to store
            const handleSuccess = (result: MessageResult) => chatStore
                .addMessage({
                    ...getMetaData(chatStore),
                    sender: 'bot',
                    text: result?.response,
                    model: result?.model,
                    ...result?.image && { imageSrc: result.image }
                });

            
            console.log("chatScripts.handleSendPicture: ", chatStore, imageSrc)
            // Combining updating database and making request to llm
            // Only need to send the current message and conversation id
            // Will query the running messages from the backend
            await serverMutation.mutate({
                url: (paths as any).postChat,
                payload: {
                    id: chatStore.activeChat.id,
                    message: ({
                        ...getMetaData(chatStore),
                        sender: 'user',
                        text: inputMessage,
                        model: 'llava:7b-v1.6',
                        imageSrc: imageSrc,
                        visionMode: chatStore.visionMode
                    })
                }
            }, { onError: console.error, onSuccess: handleSuccess });

            // Reset
            chatStore.handleImageSrc(null);
            chatStore.handleImageClassification(null);
            // Reset view
            chatStore.handleView("chat");
        }
        // Clear the input

        // // auto-scroll the container to the bottom
        // scrollChatToBottom();
    },

    // ** handleAttachment: Handles attachment click, UI, and adds subsequent attachment to the chat
    // * @description
    // * @constructor
    // * @param {ChatStore} chatStore - Chat store
    // * @returns
    // */
    handleAttachmentClick: async (store: any) => {

        const attachmentInput = document.createElement('input');

        attachmentInput.setAttribute('type', 'file');
        attachmentInput.click();

        attachmentInput.onchange = async () => {

            const file = (attachmentInput as any).files[0];

            console.log("handleAddAttachment: ", file)

            const formData = new FormData();

            formData.append("file", file);

            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function() {
                    const base64String = reader.result;
                    console.log(base64String); // Outputs the base64 string
                    // Do something with the base64 string, e.g., send it to a server
                    store.handleImageSrc(base64String as string);
                    formData.append("image", base64String as string);
                };
                reader.onerror = function(error) {
                    console.error('Error reading file:', error);
                };
            }

            store.handleAttachment(formData);

            // const response = await fetch(paths.ingest, {
            //     method: "post",
            //     body: formData
            // });

            // console.log("response: ", response);
        };
    },

    // ** handleDownload: Downloads image from the chat
    // * @description
    // * @constructor
    // * @param {object} message - Chat message
    // * @returns
    // */
    handleDownload: (message: { imageSrc: string, text: string }) => {
        const link = document.createElement('a');
        link.download = 'ai-family-image.png';
        link.href = message?.imageSrc;
        link.click();
    },

    // ** handleCopy: Copies text from the chat
    // * @description
    // * @constructor
    // * @param {object} message - Chat message
    // * @returns
    // */
    handleCopy: (message: { imageSrc: string, text: string }) => {
        navigator
            .clipboard
            .writeText(message?.imageSrc || message?.text);
    },

    // ** handleKeyPress: Handles key press events
    // * @description
    // * @constructor
    // * @param {KeyboardEvent} event - Keyboard event
    // * @param {ChatStore} chatStore - Chat store
    // * @param {function} handleSendMessage - Sends message to the backend
    // * @returns
    // */
    handleKeyPress: (event: KeyboardEvent, chatStore: any, handleSendMessage: () => void) => {
        console.log("key pressed: ", event);

        if ((event.shiftKey && event.key === 'Enter')) 
            chatStore.handleInput(chatStore.inputMessage + '\n');
        else if (event.key === 'Enter') handleSendMessage();
        else if (event.key === 'Escape') {
            chatStore.handleImageSrc(null);
            // Reset view
            chatStore.handleView("chat");
        }
    }

};

export { chatScripts };
export default chatScripts;