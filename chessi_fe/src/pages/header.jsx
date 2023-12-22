import {Link} from 'react-router-dom';
import './TrangChu.css';

export default function header() {
    return(
        <> 
        <div className="header">
            <img className="logo" src="Chessi.png" alt=""/>
            <div className="home">
                <Link to={"/"}>Home</Link>
            </div>
            <div className="sreachbox">
                <input type="text" className="sreachbox_input" placeholder="Tìm kiếm..." />
            </div>
            <div className="right_item">
                <img className="icon" src="message.png" alt=""/>
                <img className="icon" src="notice.png" alt=""/>
                <img style={{width: "72px", height: "44px"}} src="information.png" alt=""/>
            </div>
        </div>
        </>
    )
}
