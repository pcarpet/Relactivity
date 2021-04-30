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
	
    toggleClass(){
		//console.log( "toogle "+this.props.data.selected);
		if(this.props.data.selected){
			 return "containerItemList itemSelected"
		}else{
			return "containerItemList"
		}
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




	

	

 



class ListItineraire extends React.Component {

	constructor(props) {
		super(props);
		this.list=props.list;
		this.selection=props.selection;
		this.changeColor=this.changeColor.bind(this);
		this.state = {
			selection: this.props.selection || undefined,
			background:"violet",
			listSections:this.list,
		};
	}
	
	changeColor(id){
		//console.log("change Background");
		//console.log(this.list);
		for(var i=0;i<this.list.length;i++){
			for(var j=0;j<this.list[i].data.length;j++){
				//console.log("tabid "+this.list[i].data[j].id);
				//whiteconsole.log("idselected "+id);
				if(this.list[i].data[j].id===id){
					this.list[i].data[j].selected=true;
				}else{
					this.list[i].data[j].selected=false;
				}
				
			}
		}
		//console.log(this.list);
		this.selection(id);
		this.setState({listSections:this.list});
		
	}
	
	
	

	render() {
	    return (
	      <View style={styles.container} >
	        <SectionList
			sections={this.state.listSections}
			renderItem={({item}) => <Item data={item}  cbBg={this.changeColor} />}
	          renderSectionHeader={({section}) => <Text style={styles.sectionHeader} >{section.title}</Text>}
	          keyExtractor={(item, index) => index}
	        />
	      </View>
	    );
	}
}


export default ListItineraire;

