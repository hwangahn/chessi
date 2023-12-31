import { Navigate, Outlet } from "react-router-dom";
import { message } from "antd";
import { AuthContext } from '../contexts/auth';
import { useContext } from 'react';

export default function ProtectedRouteAdmin() {
    let { accessToken, profile } = useContext(AuthContext);

    if (!accessToken || !profile?.isAdmin) {
        message.error('You are not admin!');
        return <Navigate to='/' />
    } else {
        return <Outlet/>;
    }
}