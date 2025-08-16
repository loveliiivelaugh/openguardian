import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

interface TableIconProps {
    isTableActive: boolean;
    // Add other props here...
    key: number; 
    children: number; 
    onClick: () => Promise<void>;
}

// Custom styles used throughout the application
export const Styled = {

    // ./components/TableLayout/TableLayout.tsx
    TableIcon: styled(Box, { shouldForwardProp: (prop) => prop !== "isTableActive" })(({ isTableActive, theme }: any) => ({
        height: "50px",
        width: "50px",
        textAlign: "center",
        py: theme.spacing(1),
        paddingTop: theme.spacing(1.5),
        borderRadius: "10px",
        ...isTableActive
            ? { 
                // If the table is active, apply the following styles
                backgroundColor: "#333", 
                color: "#aaa",
                "&:hover": {
                    backgroundColor: "#222",
                    color: "#ddd",
                    cursor: "pointer"
                }
            } : {
                // If the table is inactive, apply the following styles
                backgroundColor: "white",
                color: "black",
                "&:hover": {
                    backgroundColor: "#333",
                    color: "#aaa",
                    cursor: "pointer"
                }
            }
    })) as React.ComponentType<TableIconProps>,

    // ./components/Admin/AdminDashboard.tsx
    ModalContainer: styled(Box)(({ theme }) => ({
        position: "absolute", 
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        p: 4,
        borderRadius: "10px"
    })),

    // ./components/Image.tsx
    PictureFrame: styled(Box)(() => ({
        border: "2px solid #333", 
        borderRadius: "10px", 
        "&:hover": { 
            cursor: "pointer" 
        } 
    })),

    // Shared styles
    BottomNavWrapper: styled(Box)(() => ({
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: "100vw",
        overflow: "auto" 
    })),
    GridSection: styled(Grid)(({ theme }) => ({ 
        // marginTop: "94px", 
        backgroundColor: "rgba(33, 33, 33, 0.9)", 
        backdropFilter: "blur(5px)", 
        borderTop: "4px solid #a33", 
        borderBottom: "4px solid #a33", 
        p: theme.spacing(2) 
    }))

}
