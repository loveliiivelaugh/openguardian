import { Box, Modal, Typography } from '@mui/material';
import useUtilityStore from '@store/utilityStore';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxWidth: "100vw",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
};

export default function BasicModal() {
    const { modal, setModal } = useUtilityStore();
    const handleClose = () => setModal({ open: false });

    let styleOverrides = modal?.sx?.slots?.box ?? {};
    if (typeof styleOverrides === "function") styleOverrides = styleOverrides(style);

    return (
        <>
            <Modal
                open={modal.open || false}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{...style, ...styleOverrides}}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {modal.title || null}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {modal.content || null}
                    </Typography>
                </Box>
            </Modal>
        </>
    );
};



type StepModalProps = {
    steps: ((props: { next: () => void; formData: any; setFormData: (data: any) => void }) => React.ReactNode)[];
};

export const useMultiStepModal = () => {
    const utilityStore = useUtilityStore();

    const showSteps = ({ steps }: StepModalProps) => {
        let currentStep = 0;
        let formData: any = {};

        const setFormData = (newData: any) => {
            formData = { ...formData, ...newData };
        };

        const next = (nextProps?: any) => {
            currentStep += 1;
            if (currentStep >= steps.length) {
                utilityStore.setModal({ open: false, content: null });
                return;
            }

            utilityStore.setModal({
                open: false,
                content: null
            });

            setTimeout(() => {
                utilityStore.setModal({
                    open: true,
                    content: steps[currentStep]({ next, formData, setFormData }),
                    ...nextProps && nextProps
                });
            }, 150);
        };

        utilityStore.setModal({
            open: true,
            content: steps[currentStep]({ next, formData, setFormData })
        });
    };

    return { showSteps };
};
