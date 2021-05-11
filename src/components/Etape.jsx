import React from 'react';
import { Text } from 'react-native';
import styles from './Etape.module.css';

class Etape extends React.Component{
	constructor(props){
		super(props);
		this.onClickItem=this.onClickItem.bind(this);
		this.state={"id":props.data.id};

	}


	onClickItem(){
			console.log("Click sur l'item" + this.state.id);
			this.props.cbBg(this.state.id);
			//console.log(e.nativeEvent.srcElement.innerText);		
	}
	
/* 'id' : idEtape++,
        'date' : values.dateetape,
        'googlePlace' : this.state.selectedPlace,
        'googleFormattedAdress' : this.state.googleFormattedAddress,
				'lat' : this.state.placeFound.lat,
				'long' : this.state.placeFound.lng,
				'selected' : true */		
	render(){
		return (

			 <div className={this.props.data.selected ? "containerItemList itemSelected" : "containerItemList"}  onClick={this.onClickItem} >
		
					<div style={{"postion": "relative",width:"100%",height:"60%"}}>
						<Text style={styles.item} id={this.props.data.id} lat={this.props.data.lat} long={this.props.data.long} >
							{this.props.data.googleFormattedAdress}
						</Text>
					</div>
					<div style={{"postion": "relative",width:"100%",height:"40%"}}>
						<div style={{"postion": "relative",width:"25%",height:"100%","float":"left"}}>
							<Text className="containerSubitem" >{this.props.data.lat}</Text>
						</div>
						<div style={{"postion": "relative",width:"25%",height:"100%","float":"left"}}>
							<Text className="containerSubitem" >{this.props.data.long}</Text>
						</div>
						<div style={{"postion": "relative",width:"50%",height:"100%","float":"left"}}>
							<Text className="containerSubitem" >{this.props.data.date}</Text>
						</div>
					</div>
		  	  </div>

		);
	}
}

export default Etape;
