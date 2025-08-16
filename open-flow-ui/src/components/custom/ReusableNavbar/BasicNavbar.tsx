import { AppBar, Toolbar, ListItemText, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";

export default function BasicNavbar() {
    const navigate = useNavigate();
    return (
        <AppBar sx={{ backgroundColor: "transparent", color: "#333", backdropFilter: "blur(10px)", boxShadow: "none" }}>
            <Toolbar>
                <ListItemText primary={
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        AgentFlow
                    </Typography>
                } secondary="AgentFlow" />
                <Button color="inherit" onClick={() => navigate('/dashboard')}>Home</Button>
                <Button color="inherit" onClick={() => navigate('/builder')}>Builder</Button>
                <Button color="inherit">Contact</Button>
                <Button color="inherit">Pricing</Button>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    )
};