import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { FloatButton } from 'antd';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import socket from './utils/socket';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route exact path='/' Component={Home}></Route>
				<Route path='/login' Component={Login}></Route>
				<Route path='/signup' Component={Signup}></Route>
			</Routes>
			<FloatButton.BackTop visibilityHeight={100} />
		</BrowserRouter>
	)
}

