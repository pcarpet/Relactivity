import './App.css';
import {Routes, Route} from 'react-router-dom';
import React from 'react';
import Core from './components/Core';
import AuthBar from './components/auth/AuthBar';
//import SignUpModal from './components/auth/SignUpModal';
import SignInModal from './components/auth/SignInModal';
import Private from './Private'
require('dotenv').config();

class App extends React.Component {
		
	render(){
	    return (
		<div className="App">
			<SignInModal/>
			<AuthBar/>
			<Routes>
				<Route path='/private' element={<Private/>} >
					<Route path="/private/private-home" element={<Core />} />
				</Route>
			</Routes>
	    </div>
	    );
	}
  
}

export default App;
