import { useEffect, useState } from 'react'
import { supabase } from '@api/supabase'
import { useSupabaseStore } from '@store/supabaseStore'
import { useNavigate } from 'react-router' // or next/router if using Next.js
import { CircularProgress, Box } from '@mui/material'


export async function manuallyHydrateSessionFromUrl() {
  const hash = window.location.hash
  const params = new URLSearchParams(hash.substring(1)) // strip the #

  const access_token = params.get('access_token')
  const refresh_token = params.get('refresh_token')
  const expires_in = params.get('expires_in')
  const token_type = params.get('token_type')

  if (access_token && refresh_token && expires_in && token_type) {
    const session = {
      access_token,
      refresh_token,
      expires_in: parseInt(expires_in),
      token_type,
      user: null // Supabase will fill this in
    }

    console.log('🧪 Hydrating session manually', session)

    // Save it into Supabase client
    const authenticatedSession = await supabase.auth.setSession({
      access_token,
      refresh_token
    });

    console.log('👨🏻‍🔬 Authenticated Session:? ', authenticatedSession)

    // Optional: Remove token from URL
    window.history.replaceState({}, document.title, window.location.pathname)

    return authenticatedSession;
  }
}

type AuthGateProps = {
  children: React.ReactNode
  redirectTo?: string
  allowBypass?: boolean
}

export const AuthGate = ({ children, redirectTo = '/login', allowBypass = false }: AuthGateProps) => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { session, setSession }: any = useSupabaseStore()

  useEffect(() => {
    const hydrateSession = async () => {
      // Handle OAuth hash-based tokens
      if (window.location.hash.includes('access_token')) {
        const url = new URL(window.location.href)
        window.history.replaceState({}, document.title, url.pathname)
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSession(session)
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      setLoading(false)
    }

    hydrateSession()
  }, [])

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!session && !allowBypass) {
    navigate(redirectTo)
    return null
  }

  return <>{children}</>
}
