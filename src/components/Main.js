import React from 'react';

import ContactForm from './ContactForm';
import { Outlet, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "../view/view.css"
class Main extends React.Component {
    render() {
        return (

                <Outlet/>
        );
    }
}

export default Main;
