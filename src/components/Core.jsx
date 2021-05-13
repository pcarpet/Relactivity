import React from 'react';
import SplitPane, { Pane } from 'react-split-pane';
import moment from "moment";
import ListEtape from './ListEtape'
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
		this.state = {
      listV: [
        {
          googleFormattedAdress: "13 rue des trucs, Paris",
          nomEtape : "Location voiture",
          lat: 48.866667,
          long: 2.333333,
          id: 1,
          selected: false,
          date: moment("2015-02-01", "YYYY-MM-DD"),
        },
        {
          googleFormattedAdress: "Place du chateau",
          nomEtape : "Chateau de versaille",
          lat: 48.801408,
          long: 2.130122,
          id: 2,
          selected: false,
          date: moment("2015-01-03", "YYYY-MM-DD"),
        },
        {
          googleFormattedAdress: "Rambouillet",
          nomEtape : "Visite de la ville",
          lat: 48.643868,
          long: 1.829079,
          id: 3,
          selected: false,
          date: moment("2015-04-01", "YYYY-MM-DD"),
        },
        {
          googleFormattedAdress: "2 rue des Auberges, Chartre",
          nomEtape: "Nuit à l'hotel",
          lat: 48.443854,
          long: 1.489012,
          id: 4,
          selected: false,
          date: moment("2015-02-04", "YYYY-MM-DD"),
        },
        {
          googleFormattedAdress: "Impasse de la fourchette, Châteaudun",
          nomEtape:"Resto de ouff",
          lat: 48.0708,
          long: 1.3237,
          id: 5,
          selected: false,
          date: moment("2015-04-01", "YYYY-MM-DD"),
        },
      ],
      position: [48.85, 2.33],
      zoom: 11,
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

		//Tri des étapes par chronologie
		listLocal.sort(function (a, b) {
			// Turn your strings into dates, and then subtract them
			// to get a value that is either negative, positive, or zero.
			return a.date - b.date;
		})

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
         {/*  <Button
            title="Check"
            color="#005500"
            onPress={() => console.log(this.state.listV)}
          /> */}
          <div className="StepFinder">
            <StepFinder addEtape={this.addEtape} />
          </div>
          <SplitPane
            split="vertical"
            allowResize={true}
            defaultSize="50%"
            resizerStyle={stylesSpliter}
          >
            <Pane className="CarteList">
              <ListEtape
                listV={this.state.listV}
                selectEtape={this.selectEtape}
              />
            </Pane>
            <Pane className="CarteMod">
              {/* <Button
                title="Dezoom"
                color="#005500"
                onPress={() => this.setState({ zoom: 8 })}
              />
              <Text>
                Before Position: {this.state.position[0]} ,{" "}
                {this.state.position[1]}{" "}
              </Text> */}
              <Carte
                list={this.state.listV}
                center={this.state.position}
                zoom={this.state.zoom}
              />
            </Pane>
          </SplitPane>
        </div>
      );
	}
  
}


export default Core;
