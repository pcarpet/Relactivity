import React from 'react';

class StepFinder extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            etapeIdCount : 9,
		};

		this.addItem = this.addItem.bind(this);

	}


    addItem(e){
		if (this._inputElement.value !== "") {
            
			var idEtape = this.state.etapeIdCount;
			var newItem = {
				'id': idEtape++,
				'ville': this._inputElement.value,
				'lat':48.9,
				'long':2.4,
				'selected':true
			};
			this.setState({etapeIdCount:idEtape});
			this.props.addEtape(newItem);
		  }
		   
		  console.log(this.state.id);
			 
		  e.preventDefault();
	}

    render() {
	    return (
			<form onSubmit={this.addItem}>
						<input ref={(a) => this._inputElement = a } placeholder="enter city">
						</input>
						<button type="submit">add</button>
			</form>
	
	    );
	}


}

export default StepFinder