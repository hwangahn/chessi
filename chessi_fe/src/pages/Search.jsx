import view from './view.module.css';
import { Button } from "reactstrap";

import VerticalmenuUser from '../components/verticalmenuUser';

import { useNavigate } from 'react-router-dom';

export default function Search() {  
    let navigate = useNavigate();   
    return (
        <>    
            <div id="leftbar" style={{float:"left"}}>
                <VerticalmenuUser />
            </div>   
            <div className={view.content}>
                <div className={view.title}>
                    <h1 style={{textShadow: "0 0 1.3 #396FAE"}}>Search</h1>
                </div>
                <h1>Search Result:</h1>
                <div className={view.Profile}>
                    <div className={view.Profile_text}>
                        <Button Button className={view.btn_fill} type="submit">Follow </Button>
                        <Button className={view.btn_fill} type="submit">Spectate</Button>
                    </div>
                </div>
                <div className={view.chartProfile} style={{height:"auto"}}>
                {/* <h2>Current rating:{rating}</h2> */}
                </div>
            </div>
        </>
    )
        ;
}

