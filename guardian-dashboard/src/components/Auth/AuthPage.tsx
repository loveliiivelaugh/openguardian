import type { Provider } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useSupabaseStore } from "@store/supabaseStore";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Alert,
  Paper
} from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@api/supabase";
// import { AppRouter } from '@components/routes/Router'
import { GitHub, Google } from "@mui/icons-material";
// import userJson from './user.json';

const isDev = (import.meta.env.MODE === 'development');

const Authenticated = () => {
  const navigate = useNavigate();
  navigate('/dashboard')
  return null;
};

const redirectTo =
  window.location.hostname.includes('localhost')
    ? 'http://localhost:5173'
    : 'https://memory.woodwardwebdev.com';

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (provider: Provider) => {
    setLoading(true);
    setError(null);
    console.log("Handle Login: ", provider)
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) setError(error.message);
    setLoading(false);
  };

  const { session, setSession }: any = useSupabaseStore();

  console.log("👨🏻‍💻 User Session: ", session)

  useEffect(() => {

    let authSubscription: any;
    if (!isDev) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log("👨🏻‍💻 User getSession: ", session)
        setSession(session)
      })
  
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!subscription) return;
        authSubscription = subscription;
        console.log("👨🏻‍💻 User SessionChange: ", session)
        setSession(session)
      })
    } else {
      // setSession(userJson)
    }

    if (session) navigate('/dashboard')

    return () => authSubscription && authSubscription.unsubscribe()
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
              Sign in to 👨‍💼 Memory.me 🌀
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              fullWidth
              variant="outlined"
              // @ts-expect-error
              color="text.secondary"
              onClick={() => handleLogin('google')}
              disabled={loading}
            >
              Sign Up with Google <Google />
            </Button>
            <Button
              fullWidth
              variant="outlined"
              // @ts-expect-error
              color="text.secondary"
              onClick={() => handleLogin('github')}
              disabled={loading}
            >
              Sign Up with Github <GitHub />
            </Button>
            {isDev && (
              <Button
                fullWidth
                variant="outlined"
                // @ts-expect-error
                color="text.secondary"
                onClick={() => handleLogin('github')}
                disabled={loading}
              >
                Sign Up with Notion 📚
              </Button>
            )}
            {/* <Typography variant="body2" textAlign="center" color="text.secondary">
              Don't have an account? Contact your instructor.
            </Typography>
            <Grid container>
              <Grid size={12}>
                {[
                  // @ts-ignore
                  ...isDev ? [
                    {
                      label: "Admin",
                      user: "guardian@woodwardwebdev.com",
                      pass: import.meta.env.VITE_ADMIN_PASS
                    },
                    {
                      label: "Guest",
                      user: "mwoodward1@woodwardwebdev.com",
                      pass: import.meta.env.VITE_GUEST_PASS
                    },
                  ] : [],
                  {
                    label: "Bypass",
                    user: "bypass@schedme.io",
                    pass: import.meta.env.VITE_GUEST_PASS
                  }
                ].map((defaultCreds, index) => (
                  <Button
                    key={index}
                    color="inherit"
                    onClick={async () => {
                      console.log("using default creds: ", defaultCreds)
                      if (defaultCreds.label === "Bypass") {
                        setSession({ fake: true })
                      } else {
                        const result = await supabase.auth.signInWithPassword({ email: defaultCreds.user, password: defaultCreds.pass })
                        console.log("result: ", result)
                      }
                    }}
                    sx={{ textTransform: "none" }}
                  >
                    <ListItemText 
                      primary={defaultCreds.label} 
                      secondary={
                        <Typography variant="subtitle1" color="error">
                          For Development
                        </Typography>
                      }
                    />
                  </Button>
                ))}
              </Grid>
            </Grid> */}
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
  else return <Authenticated />
  // else return <AppRouter />
};

export default LoginPage;
