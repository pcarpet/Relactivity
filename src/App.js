import './App.css';
import {Routes, Route} from 'react-router-dom';
import React from 'react';
import {Layout} from 'antd';
import Core from './components/Core';
import AuthBar from './components/auth/AuthBar';
//import SignUpModal from './components/auth/SignUpModal';
import SignInModal from './components/auth/SignInModal';
import Private from './Private'


const { Header, Content } = Layout;

class App extends React.Component {
		
	render(){
	    return (
		<Layout className="App">
			<SignInModal/>
			<Header className="myBar">
				<AuthBar/>
			</Header>
			<Content>
				<Routes>
					<Route path='/private' element={<Private/>} >
						<Route path="/private/private-home" element={<Core />} />
					</Route>
				</Routes>
			</Content>
	    </Layout>
	    );
	}
  
}

export default App;
