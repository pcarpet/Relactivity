import './App.css';
import React from 'react';
import Core from './components/Core';
require('dotenv').config();



class App extends React.Component {
		
	
	render(){
	    return (
		<div className="App">
			<Core/>
	    </div>
	    );
	}
  
}

export default App;
