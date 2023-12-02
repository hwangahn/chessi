import React from 'react';
import ReactDOM from 'react-dom/client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import App from './components/App';
import Expenses from "./routes/expenses";
import Invoices from "./routes/Invoices";
import NotFound from "./routes/NotFound";
import Invoice from "./routes/Invoice";
import Follow from "./view/Follow";
import Forum from "./view/Forum";
import FriendList from "./view/FriendList";
import History from "./view/History";
import Play from "./view/Play";
import Premium from "./view/Premium";
import Puzzle from "./view/Puzzle";
import Ranking from "./view/Ranking";
ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
    <BrowserRouter>

        <Routes>
            <Route path="/" element={<App />}>
                {/*<Route path="FriendList" element={<FriendList/>}/>*/}
                <Route path="Follow" element={<Follow />} />
                <Route path="FriendList" element={<FriendList />} />
                <Route path="History" element={<History />}/>
                <Route index element={< Play/>}/>
                <Route path="Premium" element={< Premium/>}/>
                <Route path="Puzzle" element={<Puzzle />}/>
                <Route path="Ranking" element={<Ranking />}/>
                <Route path="Forum" element={<Forum />}/>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    </BrowserRouter>

</React.StrictMode>
);