import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

export default function BlurOnScroll({ children }: any) {
    const containerRef = useRef(null);
    const [isNearBottom, setIsNearBottom] = useState(false);

    useEffect(() => {
        const container: any = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const nearBottom = scrollTop + clientHeight >= scrollHeight - 100; // adjust threshold
            setIsNearBottom(nearBottom);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Box
            ref={containerRef}
            sx={{
                maxHeight: '100vh',
                overflowY: 'auto',
                position: 'relative',
                px: 2,
            }}
        >
            <Container maxWidth="sm" sx={{ mt: 20, position: 'relative' }}>
                {children}

                {/* Blurring overlay */}
                {/* <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 100,
                        pointerEvents: 'none',
                        backdropFilter: isNearBottom ? 'blur(8px)' : 'none',
                        transition: 'backdrop-filter 0.3s ease',
                    }}
                /> */}
            </Container>
        </Box>
    );
}
