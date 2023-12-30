import { Navigate, Outlet } from "react-router-dom";
import { message } from "antd";
import { AuthContext } from '../contexts/auth';
import { useContext } from 'react';

export default function ProtectedRouteUser() {
    let { accessToken } = useContext(AuthContext);

    if (!accessToken) {
        message.error('You are not logged in!');
        return <Navigate to='/' />
    } else {
        return <Outlet/>;
    }
}