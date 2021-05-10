import './App.css';
import React from 'react';
import SplitPane, { Pane } from 'react-split-pane';
import Carte from './components/Carte.jsx'
import ListItineraire from './components/ListItineraire'
import StepFinder from './components/Stepfinder'
import { Text,Button } from "react-native";

const stylesSpliter = {
  background: '#000',
  width: '2px',
  cursor: 'col-resize',
  margin: '0 5px',
  height: '100%',
};


class App extends React.Component {
	
	constructor(props){
		super(props);
		this.state={
			listV:[	{'ville':'Paris','lat':48.866667,'long':2.333333,'id':1,'selected':false}, 
					{'ville':'Versailles','lat':48.801408,'long':2.130122,'id':2,'selected':false},
					{'ville':'Rambouillet','lat':	48.643868,'long':1.829079,'id':3,'selected':false},
			   	    {'ville':'Chartres','lat':48.443854,'long':1.489012,'id':4,'selected':false},
					{'ville':'Châteaudun','lat':48.0708,'long':1.3237,'id':5,'selected':false},
					{'ville':'Le mans','lat':48.00611,'long':0.199556,'id':6,'selected':false},
					{'ville':'Angers','lat':47.478419,'long':-0.563166,'id':7,'selected':false},],
			position:[48.85, 2.33],
			zoom:11,
		};
		this.onSelection=this.onSelection.bind(this);
		this.addEtape=this.addEtape.bind(this);
		this.selectEtape=this.selectEtape.bind(this);

	}



	addEtape(etape){
		console.log("etape : " + etape)
		var listLocal=this.state.listV;
		// Ajout de l'étape à la liste
		listLocal.push(etape);
		this.setState({listV:listLocal});
		//On centre la carte sur la nouvelle étape
		this.selectEtape(etape.id);
	}

	selectEtape(idEtape){
		var selectionList = this.state.listV;
		for(const ligne of selectionList){
			if(ligne.id===idEtape){
				ligne.selected=true;
			}else{
				ligne.selected=false;
			}
		};

		this.setState({ListV:selectionList});
		this.onSelection(idEtape);
	}
	
	onSelection(id){
		console.log("onselection "+id);
		const listV = this.state.listV;
		for(const etape of listV){
		    //Mise à jour de la position de la carte
			if(etape.id===id){
			    console.log({position:[etape.lat,etape.long]});
		     	this.setState({position:[etape.lat,etape.long]},console.log("new pos ok " ));
			}
		}
		
	}
	

	render(){
	    return (
	    <div className="App">
			<Button title="Check" color="#005500" onPress={() => console.log(this.state.listV) } />
			<div className="StepFinder">
				<StepFinder addEtape={this.addEtape} />
			</div>
			<SplitPane split="vertical" allowResize={true} defaultSize="50%" resizerStyle={stylesSpliter}>
				<Pane className="CarteList">
					<ListItineraire listV={this.state.listV} selectEtape={this.selectEtape} />
				</Pane>
				<Pane  className="CarteMod">
					<Button title="Dezoom" color="#005500" onPress={() => this.setState({zoom:8}) } />
						<Text >Before Position: {this.state.position[0]} , {this.state.position[1]} </Text>
					<Carte list={this.state.listV} center={this.state.position} zoom={this.state.zoom} />
				</Pane>
	  	  </SplitPane>
      
	    </div>
	    );
	}
  
}

export default App;
