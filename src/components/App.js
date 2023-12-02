import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import VerticalMenu from "./VerticalMenu";
import {Link, Outlet} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "../view/view.css"
class App extends React.Component {
    render() {
        return (
            <div>

                <Header />
                <VerticalMenu/>
                <Main/>
            </div>
        );
    }
}

export default App;
