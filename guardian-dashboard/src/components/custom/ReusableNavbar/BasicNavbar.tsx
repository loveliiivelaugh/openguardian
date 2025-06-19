import { AppBar, Toolbar, ListItemText, Typography, Button, ListItem, TextField, Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router";
import { useSupabaseStore } from "@store/supabaseStore";
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';

export default function BasicNavbar() {
    const navigate = useNavigate();
    const supabaseStore = useSupabaseStore();
    return (
        <AppBar sx={{ backgroundColor: "transparent", color: "#333", backdropFilter: "blur(10px)", boxShadow: "none" }}>
            <Toolbar>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <ListItem sx={{ flexGrow: 1, minWidth: 200 }}>
                        <ListItemText primary={
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    ⚫️⚪️ Memory.me
                                </Typography>
                            }
                        />
                    </ListItem>
                    {supabaseStore?.session?.user?.email}
                    <Button color="inherit" onClick={() => navigate('/dashboard')}>Home</Button>
                    <Button color="inherit">Pricing</Button>
                    {supabaseStore.session ? (
                        <>
                            <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => navigate('/')}>Login</Button>
                    )}
                </Box>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="🔍 Search"
                    // value={query}
                    // onChange={(e) => setQuery(e.target.value)}
                    // onKeyDown={(e) => e.key === 'Enter' && fetchRelated(query)}
                />
                <IconButton color="inherit">
                    <NotificationsIcon />
                </IconButton>
                <IconButton color="inherit">
                    <PersonIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
};