import view from './view.module.css';
import { Link } from "react-router-dom";
// reactstrap components
import { Table } from "reactstrap";
import { UserOutlined } from '@ant-design/icons';
import VerticalmenuAdmin from '../components/verticalmenuAdmin';
export default function AdminHome() {
    return (
        <>
        <div id="leftbar" style={{float:"left"}}>
            <VerticalmenuAdmin />
        </div>
        {/* <div className={view.content}>    
            <div className={view.title}>
                <h1 style={{textAlign:"center"}}>Dashboard</h1>
            </div>
            <div className={view.table1}>
                <div className={view.adminHome} >
                    <h1>User</h1>
                    <h2>123123</h2>
                </div>
                <div className={view.adminHome} >
                <h1>Online User</h1>
                <h2>123123</h2>
                </div>
                <div className={view.adminHome} >
                    <h1>Total Game</h1>
                    <h2>123123</h2>
                </div>

                <div className={view.adminHome} >
                <h1>Active game</h1>
                <h2>123123</h2>
                </div>
            </div>
        </div> */}
        </>
    );
}
