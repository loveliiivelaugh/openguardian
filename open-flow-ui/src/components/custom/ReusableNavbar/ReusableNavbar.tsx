import { useNavigate } from "react-router";
import {
    AppBar, Avatar, Box, 
    ListItemText, ListItem, ListItemAvatar, 
    ListItemButton, Toolbar, Typography
} from '@mui/material';
import { ThemeToggleButton } from "@theme/ThemeProvider";
import MenuIcon from "@mui/icons-material/Menu";
import useUtilityStore from "@store/utilityStore";
import HamburgerMenu from "./HamburgerMenu";

export const Navbar = () => {
    const utilityStore = useUtilityStore();
    const navigate = useNavigate();

    const navItems = [
        {
            label: "Home",
            path: "/"
        },
        // {
        //     label: "Payment",
        //     path: "/payment"
        // },
        // {
        //     label: "Success",
        //     path: "/success"
        // },
        // {
        //     label: "Cancel",
        //     path: "/cancel"
        // },
        {
            label: <ThemeToggleButton />
        },
        {
            label: <HamburgerMenu />
        }
    ];

    return (
        <AppBar
            sx={{
                zIndex: 100,
                backdropFilter: "blur(12px)",
                bgcolor: "transparent",
                border: "none",
                boxShadow: "none",
                color: (utilityStore.colorMode === "light") ? "#333" : "#ccc"
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>S</Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                        primary={
                            <Typography color="inherit" variant="h6" component="h6">
                                ScheduleTime
                            </Typography>
                        }
                    />
                </ListItem>
                <Box sx={{ display: "flex", width: "100%" }}>
                    {navItems.map((listItem: any, index: number) => (
                        <ListItemText 
                            key={index}
                            // @ts-ignore
                            component={ListItemButton}
                            primary={listItem.label}
                            color="inherit"
                            onClick={listItem?.path
                                ? () => listItem.path && navigate(listItem.path)
                                : listItem.onClick
                            }
                        />
                    )).filter(Boolean)}
                </Box>
            </Toolbar>
        </AppBar>
    );
};