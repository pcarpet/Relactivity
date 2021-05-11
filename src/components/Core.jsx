import React from 'react';
import SplitPane, { Pane } from 'react-split-pane';
import ListItineraire from './ListItineraire'
import StepFinder from './Stepfinder'
import Carte from './Carte'
import { Text,Button } from "react-native";

const stylesSpliter = {
  background: '#000',
  width: '2px',
  cursor: 'col-resize',
  margin: '0 5px',
  height: '100%',
};


class Core extends React.Component {
	
	constructor(props){
		super(props);
		this.state={
			listV:[	{'googleFormattedAdress':'Paris','lat':48.866667,'long':2.333333,'id':1,'selected':false}, 
					{'googleFormattedAdress':'Versailles','lat':48.801408,'long':2.130122,'id':2,'selected':false},
					{'googleFormattedAdress':'Rambouillet','lat':	48.643868,'long':1.829079,'id':3,'selected':false},
			   	    {'googleFormattedAdress':'Chartres','lat':48.443854,'long':1.489012,'id':4,'selected':false},
					{'googleFormattedAdress':'Châteaudun','lat':48.0708,'long':1.3237,'id':5,'selected':false},
				],
			position:[48.85, 2.33],
			zoom:11,
		};
		this.onSelection=this.onSelection.bind(this);
		this.addEtape=this.addEtape.bind(this);
		this.selectEtape=this.selectEtape.bind(this);

	}


	/* Ajoute l'étape remontée par le composant StepFinder à la liste*/
	addEtape(etape){
		console.log("etape : " + etape)
		var listLocal=this.state.listV;
		// Ajout de l'étape à la liste
		listLocal.push(etape);
		this.setState({listV:listLocal});
		//On centre la carte sur la nouvelle étape
		this.selectEtape(etape.id);
	}

	/* Déclanchement de la sélection d'un étape */
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
	
	/* TODO : à fusionner avec select etape */
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
	    
		<div className="Core">
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


export default Core;
