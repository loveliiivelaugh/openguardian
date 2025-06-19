import { Alert, AlertTitle, Box, Button, Modal, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { type ConfirmType, useUtilityStore } from "@store/index";

const Styled = {
    ModalContainer: styled(Box)(() => ({
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        // boxShadow: 24,
        p: "32px",
    }))
};

const ConfirmProvider = ({ children }: { children?: React.ReactNode }) => {
    const { confirm } = useUtilityStore();
    const handleAnswer = (answer: boolean) => confirm?.onConfirm && confirm.onConfirm(answer);
    return (
        <>
            {children}
            <Modal
                open={confirm.open}
                onClose={() => handleAnswer(false)}
            >
                <Styled.ModalContainer>
                    <Alert
                        // @ts-expect-error
                        severity={confirm?.severity || "info"}
                        sx={{ width: "100%" }}
                        onClose={() => handleAnswer(false)}
                    >
                        <AlertTitle>{confirm?.title || "Confirm"}</AlertTitle>
                        <Typography>{confirm?.message || "Are you sure?"}</Typography>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 1 }}>
                            <Button variant="contained" color="primary" onClick={() => handleAnswer(true)}>
                                {confirm?.continueText ? confirm.continueText : "Yes"}
                            </Button>
                            <Button variant="outlined" color="error" onClick={() => handleAnswer(false)}>
                                {confirm?.cancelText ? confirm.cancelText : "No"}
                            </Button>
                        </Box>
                    </Alert>
                </Styled.ModalContainer>
            </Modal>
        </>
    );
};

// Hook
export default ConfirmProvider

export const useConfirm = () => {
    const { setConfirm } = useUtilityStore();

    const handleConfirm = (
        answer: boolean, 
        args: any, 
        resolve?: (value: boolean | PromiseLike<boolean>) => void
    ) => {
        if (args?.onConfirm) args.onConfirm(answer, resolve);
        else resolve && resolve(answer);
        setConfirm({ open: false });
    };

    const open = (args: ConfirmType) => new Promise((resolve) => setConfirm({
        open: true,
        title: args?.title || "Confirm",
        message: (typeof(args) === "string") 
            ? args 
            : (args?.message || ""),
        severity: args?.severity || "info",
        continueText: args?.continueText ? args.continueText : "Yes",
        cancelText: args?.cancelText ? args.cancelText : "No",
        onConfirm: (answer: boolean) => handleConfirm(answer, args, resolve),
        onCancel: () => resolve(false)
    }));

    return { open };
};