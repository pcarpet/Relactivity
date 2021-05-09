import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';


const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
 
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
	  marginTop:10,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(180,180,180,1.0)',
  },
  item: {
    padding: 2,
    fontSize: 16,
    height: 44,
	
  },
 
});


class ListItineraire extends React.Component {

	constructor(props) {
		super(props);
		this.selection= props.selection;
		this.state = {
			background:"violet",
		};

		this.addItem = this.addItem.bind(this);

	}
	
	addItem(e){
		if (this._inputElement.value !== "") {

			var newItem = {
				'id':9,
				'ville': this._inputElement.value,
				'lat':48.9,
				'long':2.4,
				'selected':true
			};
			
			this.props.addEtape(newItem);
			this.changeColor(newItem.id);
		  }
		   
		  console.log(this.state.id);
			 
		  e.preventDefault();
	}





	
	

	render() {
	    return (
	      <View style={styles.container} >
			<form onSubmit={this.addItem}>
						<input ref={(a) => this._inputElement = a } placeholder="enter city">
						</input>
						<button type="submit">add</button>
			</form>
	        <FlatList 
			    data={this.props.listV} 
			    renderItem={({item}) => <Item data={item}  cbBg={this.props.selectEtape} />}
	            keyExtractor={(item, index) => index}
	        />
	      </View>
	    );
	}
}

class Item extends React.Component{
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
	
		
	render(){
		return (

			 <div className={this.props.data.selected ? "containerItemList itemSelected" : "containerItemList"}  onClick={this.onClickItem} >
		
					<div style={{"postion": "relative",width:"100%",height:"60%"}}>
						<Text style={styles.item} id={this.props.data.id} lat={this.props.data.lat} long={this.props.data.long} >{this.props.data.ville}</Text>
					</div>
					<div style={{"postion": "relative",width:"100%",height:"40%"}}>
						<div style={{"postion": "relative",width:"50%",height:"100%","float":"left"}}>
							<Text className="containerSubitem" >{this.props.data.lat}</Text>
						</div>
						<div style={{"postion": "relative",width:"50%",height:"100%","float":"left"}}>
							<Text className="containerSubitem" >{this.props.data.long}</Text>
						</div>
					</div>
		  	  </div>

		);
	}
}



export default ListItineraire;

