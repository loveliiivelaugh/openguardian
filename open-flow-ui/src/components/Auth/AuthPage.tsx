import { useEffect } from "react";
import { useSupabaseStore } from "@store/supabaseStore";
import {
  Box,
  Typography,
  Button,
  TextField,
  Container,
  Stack,
  Alert,
  Paper,
  Grid
} from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@api/supabase";
import { AppRouter } from '@components/custom/routes/Router'

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const { session, setSession }: any = useSupabaseStore();
  console.log(session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, []);

  if (!session) return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
          <Stack spacing={3}>
            <Typography variant="h4" fontWeight={600} textAlign="center">
              🌿 Sign in to Open AgentFlow UI
            </Typography>
            <Typography variant="h6" textAlign="center">
              AI · MCP · Memory · Automation Manager
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Typography variant="body2" textAlign="center" color="text.secondary">
              Don't have an account? Contact your instructor.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
  else return <AppRouter />
};

export default LoginPage;
