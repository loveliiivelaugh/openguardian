import { Alert, Collapse, Snackbar } from "@mui/material";
import { useUtilityStore } from "@store/index";


const AlertProvider = ({ children }: { children?: React.ReactNode }) => {
    const { alert, setAlert } = useUtilityStore();
    return (
        <>
            {children && children}
            <Collapse in={alert.open}>
                <Snackbar 
                    open={alert.open} 
                    autoHideDuration={4000} 
                    onClose={() => setAlert({ ...alert, open: false })}
                >
                    <Alert
                        // @ts-expect-error
                        severity={alert.severity}
                        onClose={() => setAlert({ ...alert, open: false })}
                    >
                        {alert.message}
                    </Alert>
                </Snackbar>
            </Collapse>
        </>
    )
};

export default AlertProvider;