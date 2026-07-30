'use client';
import {useAuth} from '@/context/AuthContext';

export default function Profile() {
    const {logout} = useAuth();
    const handleLogout = async () => {
        await logout();
    };
    return (
        <div>
            <p onClick={handleLogout}>profile</p>
        </div>
    );
}
