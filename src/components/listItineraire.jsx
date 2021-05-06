import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';


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
		this.changeColor=this.changeColor.bind(this);
		this.state = {
			
			background:"violet",
			listSections:props.list,
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
				'selected':false
			};
			//local
			
			var listLocal=this.state.listSections;
			listLocal[0].data.push(newItem);
			this.setState({listSections:listLocal});
			this.selection(newItem.id);
			
			//modifParent
			//this.state.listSections[0].data.push(newItem);
			this.setState({listSections:listLocal});
		   
			this._inputElement.value = "";
		  }
		   
		  console.log(this.state.id);
			 
		  e.preventDefault();
	}



	changeColor(id){
		//console.log("change Background");
		//console.log(this.list);
		var selectionList = this.state.listSections;
		for(var i=0;i<selectionList.length;i++){
			for(var j=0;j<selectionList[i].data.length;j++){
				//console.log("tabid "+this.list[i].data[j].id);
				//whiteconsole.log("idselected "+id);
				if(selectionList[i].data[j].id===id){
					selectionList[i].data[j].selected=true;
				}else{
					selectionList[i].data[j].selected=false;
				}
				
			}
		}
		//console.log(this.list);
		
		this.setState({listSections:selectionList});
		this.selection(id);
	}
	
	
	

	render() {
	    return (
	      <View style={styles.container} >
			<form onSubmit={this.addItem}>
						<input ref={(a) => this._inputElement = a } placeholder="enter task">
						</input>
						<button type="submit">add</button>
			</form>
	        <SectionList sections={this.state.listSections} renderItem={({item}) => <Item data={item}  cbBg={this.changeColor} />}
	          renderSectionHeader={({section}) => <Text style={styles.sectionHeader} >{section.title}</Text>}
	          keyExtractor={(item, index) => index}
	        />
	      </View>
	    );
	}
}

class Item extends React.Component{
	constructor(props){
		super(props);
		this.callbackBg=props.cbBg;
		this.onClickItem=this.onClickItem.bind(this);
		this.state={"id":props.data.id};

	}


	onClickItem(e){
			//console.log(this.state.id);
			this.callbackBg(this.state.id);
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

