import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/auth';
import view from './view.module.css';
import VerticalmenuUser from '../components/verticalmenuUser';
import StudyGrid from '../components/study/grid';
import CreateStudyModal from '../components/study/createStudyModal';

export default function Studies() {
    const { accessToken } = useContext(AuthContext);

    const [studies, setStudies] = useState([]);

    useEffect(() => {
        (async () => {
            let rawData = await fetch(`/api/study/get-all`, {
                method: "GET",
                headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            });

            let data = await rawData.json();

            if (data.status == "ok") {
                setStudies(data.studies);
            } else {
                message.error(data.message);
            }
        })()
    }, []);

    return (
        <div>
            <div id="leftbar">
                <VerticalmenuUser />
            </div>
            <div className={view.content}>
                <div className={view.title}>
                    <h1 style={{ textShadow: "0 0 1.3 #396FAE" }}>Studies</h1>
                </div>
                <div className="p-7">
                    <CreateStudyModal />
                    <StudyGrid edit studies={studies} />
                </div>
            </div>
        </div>
    );
}