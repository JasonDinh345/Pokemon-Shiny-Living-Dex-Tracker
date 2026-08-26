import {LoginClient} from '@/components/login/LoginClient';
import type {Metadata} from 'next';

export const metadata: Metadata = {
    title: 'Login'
};

export default function Login() {
    return <LoginClient />;
}
