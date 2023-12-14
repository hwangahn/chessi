import {Link} from 'react-router-dom';
import './TrangChu.css';

export default function verticalmenu(){
    return(
        <>
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
                <Link to ="/new">Bạn bè</Link>
            </li>
            <li>
                <img src="choi.png" alt=""/>
                <Link to ="/new">Lịch sử đấu</Link>
            </li>
            <li>
                <img src="choi.png" alt=""/>
                <Link to ="/new">Diễn đàn</Link>
            </li>
            <li>
                <img src="choi.png" alt=""/>
                <Link to ="/new">Bảng xếp hạng</Link>
            </li>
            <li>
                <img src="choi.png" alt=""/>
                <Link to ="/new">Premium</Link>
            </li>		
        </ul>		
        </>
    )
}

