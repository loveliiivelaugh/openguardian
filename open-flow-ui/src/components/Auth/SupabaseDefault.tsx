import { useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@api/supabase'
import { AppRouter } from '@custom/routes/Router'
import { useSupabaseStore } from '@store/supabaseStore'
import { Button, Grid } from '@mui/material'

export default function App() {
    const { session, setSession }: any = useSupabaseStore();

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
        <>
            <Grid container>
                <Grid size={12}>
                    {[
                        {
                            label: "Admin",
                            user: "admin@schedme.io",
                            pass: import.meta.env.VITE_ADMIN_PASS
                        },
                        {
                            label: "Staff",
                            user: "staff@schedme.io",
                            pass: import.meta.env.VITE_STAFF_PASS
                        },
                        {
                            label: "Guest",
                            user: "guest@schedme.io",
                            pass: import.meta.env.VITE_GUEST_PASS
                        }
                    ].map((defaultCreds, index) => (
                        <Button 
                            key={index}
                            color="inherit"
                            onClick={() => supabase.auth.signInWithPassword({ email: defaultCreds.user, password: defaultCreds.pass })}
                        >
                            {defaultCreds.label}
                        </Button>
                    ))}
                </Grid>
            </Grid>
            <Auth 
                supabaseClient={supabase} 
                appearance={{ theme: ThemeSupa }} 
            />
        </>
    )
    else return <AppRouter />;
};