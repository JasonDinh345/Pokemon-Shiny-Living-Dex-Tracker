'use client';

import {useEffect, useRef} from 'react';
import Script from 'next/script';
import {useAuth} from '@/context/AuthContext';

export default function GoogleLoginButton() {
    const googleButton = useRef<HTMLDivElement>(null);
    const {googleLogin} = useAuth();
    const initializeGoogle = () => {
        if (!googleButton.current) return;

        google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: googleLogin
        });

        google.accounts.id.renderButton(googleButton.current, {
            theme: 'outline',
            size: 'large',
            width: 300
        });
    };
    useEffect(() => {
        if (!window.google || !googleButton.current) return;

        google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: googleLogin
        });

        google.accounts.id.renderButton(googleButton.current, {
            theme: 'outline',
            size: 'large',
            width: 300
        });
    }, []);
    return (
        <>
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onLoad={initializeGoogle}
            />

            <div ref={googleButton} />
        </>
    );
}
