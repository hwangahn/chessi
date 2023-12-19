import {Link} from 'react-router-dom';
import './TrangChu.css';

export default function verticalmenu(){
    const leftbar = {display:"inline", float:"left", width: "210px", height: "92vh", marginTop: "0px",
    borderRight: "2px solid #2C2B4D"}
    return(
        <>
        <div id="leftbar" style={leftbar}>
        <ul className="single-vertical-menu">
            <li>
                <img src="choi.png" alt=""/>
                <Link to ="/">Chơi</Link>
            </li> 
            <li>
                <img src="choi.png" alt=""/>
                <Link to ="/new">Câu đố</Link>
            </li>
            <li>
                <img src="choi.png" alt=""/>
                <Link to ="/new">Theo dõi</Link>
            </li>
            <li>
                <img src="choi.png" alt=""/>
                <Link to ="/friendlist">Bạn bè</Link>
            </li>
            <li>
                <img src="choi.png" alt=""/>
                <Link to ="/history">Lịch sử đấu</Link>
            </li>
            <li>
                <img src="choi.png" alt=""/>
                <Link to ="/new">Diễn đàn</Link>
            </li>
            <li>
                <img src="choi.png" alt=""/>
                <Link to ="/ranking">Bảng xếp hạng</Link>
            </li>
            <li>
                <img src="choi.png" alt=""/>
                <Link to ="/new">Premium</Link>
            </li>		
        </ul>		
        </div>
        </>
    )
}

