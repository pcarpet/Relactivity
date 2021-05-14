import React from 'react';
import SplitPane, { Pane } from 'react-split-pane';
import moment from "moment";
import ListEtape from './time/ListEtape'
import StepFinder from './Stepfinder'
import Carte from './space/Carte'

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
          id: 1,
          activityType: "travel",
          date: moment("2021-08-07", "YYYY-MM-DD"),
          googleFormattedAdress: "Terminal 2, France",
          lat: 49.0049612,
          long: 2.5907692,
          nomEtape: "Embarquement CDG",
          price: "200",
          selected: false,
        },
        {
          id: 2,
          activityType: "hotel",
          date: moment("2021-08-07", "YYYY-MM-DD"),
          googleFormattedAdress: "Via Fabio Filzi, 43, 20124 Milano MI, Italie",
          lat: 45.487847,
          long: 9.202771799999999,
          nomEtape: "Hotel 43 Station",
          price: "140",
          selected: false,
        },

        {
          id: 3,
          activityType: "activity",
          date: moment("2021-08-08", "YYYY-MM-DD"),
          googleFormattedAdress: "P.za del Duomo, 20122 Milano MI, Italie",
          lat: 45.4640976,
          long: 9.1919265,
          nomEtape: "Messe au duomo",
          price: undefined,
          selected: false,
        },
        {
          id: 4,
          activityType: "hotel",
          date: moment("2021-08-08", "YYYY-MM-DD"),
          googleFormattedAdress: "Via Fabio Filzi, 43, 20124 Milano MI, Italie",
          lat: 45.487847,
          long: 9.202771799999999,
          nomEtape: "Hotel 43 Station",
          price: undefined,
          selected: false,
        },
        {
          id: 5,
          activityType: "travel",
          date: moment("2021-08-09", "YYYY-MM-DD"),
          googleFormattedAdress:
            "Piazza Quattro Novembre, 2, 20124 Milano MI, Italie",
          lat: 45.486515,
          long: 9.2033177,
          nomEtape: "Location Fiat 500",
          price: 500,
          selected: false,
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
			    console.log("Positions géo : " + {position:[etape.lat,etape.long]});
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
                activitiesList={this.state.listV}
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
