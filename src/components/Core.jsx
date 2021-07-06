import React from 'react';
import firebase from "../firebase.js";
import SplitPane, { Pane } from 'react-split-pane';
import moment from "moment";
import ListEtape from './time/ListEtape';
import StepFinder from './Stepfinder';
import Carte from './space/Carte';


const db = firebase.database();

const stylesSpliter = {
  background: '#000',
  width: '2px',
  cursor: 'col-resize',
  margin: '0 5px',
  height: '100%',
};


class Core extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      focusOnPolylineId: undefined,
      mapKey: 0,
      position: [48.85, 2.33],
      zoom: 11,
      lastDate: moment(),
    };
    this.addEtape = this.addEtape.bind(this);
    this.selectEtape = this.selectEtape.bind(this);
    this.deleteActivity = this.deleteActivity.bind(this);
    this.setCalculatedDirection = this.setCalculatedDirection.bind(this);
    this.loadActivitiesFromDb = this.loadActivitiesFromDb.bind(this);
    this.refreshActivities = this.refreshActivities.bind(this);

  }


  componentDidMount() {
    this.loadActivitiesFromDb();
  }


  //Chargement des donnée de la base
  loadActivitiesFromDb(){
    
    console.log("Chargement des données de la base");

    db.ref("activities/pca/lombardie").get().then((snapshot) => {
    if (snapshot.exists()) {

      var activitiesConverted = [];
      snapshot.forEach((activity) => {
        //Ajout et convertion des activité de la base
        var activityFromDb = activity.val();
        activityFromDb.key = activity.key;
        activityFromDb.date = moment(activityFromDb.date, "YYYY-MM-DD");
        if(activityFromDb.heure){
          activityFromDb.heure = moment(activityFromDb.heure, "HH:mm");
        }
        activitiesConverted.push(activityFromDb);
        
      })

      this.refreshActivities(activitiesConverted);
 
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });

  }


  /* Ajoute l'étape remontée par le composant StepFinder à la liste*/
  addEtape(etape) {
    console.log("Nouvelle etape key : " + etape.key);

    var activityForDb = Object.assign({},etape);
    //TODO : faire une fonction utils pour formater les dates
    activityForDb.date = activityForDb.date.format("YYYY-MM-DD");
    activityForDb.heure = activityForDb.heure.format("HH:mm");
    const activitiesRef  = db.ref("activities/pca/lombardie");
    const newEntry = activitiesRef.push(activityForDb);

    etape.key = newEntry.key;
    
    // Ajout de l'étape à la liste
    var listLocal = this.state.activities;
    listLocal.push(etape);
    
    this.refreshActivities(listLocal);

    //On centre la carte sur la nouvelle étape
    this.selectEtape(etape.key);

  }

  //Retrie les activité par date et set la liste
  refreshActivities(listLocal){
   
     //Tri des étapes par chronologie
    listLocal.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      if (a.date - b.date === 0) {
        return a.heure - b.heure;
      };
      return a.date - b.date;
    });
    //Recalcul du rank (ben c'est mieu que la position dans un array)
    for (var i = 0; i < listLocal.length; i++) {
      listLocal[i].rank = i + 1;
    }

    //Récupération de la date la plus ancienne
    this.setState({ lastDate: listLocal[listLocal.length-1].date });

    console.log(listLocal);
    this.setState({ activities: listLocal });
  }


  /* Déclanchement de la sélection d'un étape */
  selectEtape(idEtape) {
    var selectionList = this.state.activities;
    for (const ligne of selectionList) {
      if (ligne.key === idEtape) {
        ligne.selected = true;
      } else {
        ligne.selected = false;
      }
    }

    this.setState({ ListV: selectionList });

    console.log("onselection " + idEtape);
    const activities = this.state.activities;
    for (const etape of activities) {
      //Mise à jour de la position de la carte
      if (etape.key === idEtape) {
        this.setState({ position: [etape.lat, etape.long] });
      }
    }
  }

  //Ajouter l'itinéraire calculé dans le ListeEtape entre 2 étapes (rattaché l'étape de départ)
  setCalculatedDirection(key, directionsResult) {
    var listLocal = this.state.activities;
    const index = listLocal.findIndex((etape) => etape.key === key);
    listLocal[index].directionsResult = directionsResult;
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.focusOnPolylineId = key;
    this.setState({ activities: listLocal });
    //FIXME : Si je ne fait pas un setState du Zoom le polyline avec le directionResult ne s'affiche pas sur la carte
    this.setState({ mapKey: this.state.mapKey + 1 });
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.focusOnPolylineId = undefined;
  }

  deleteActivity(key){
    console.log("Nouvelle etape key : " + key);
   //On filtre la liste d'activité pour retirer la key de l'activité à supprimer
    var listLocal = this.state.activities;
    listLocal = listLocal.filter(e => e.key !== key);
    
    //Mise à jour du state
    this.refreshActivities(listLocal);

    //Supression en base
    //db.ref("activities/pca/lombardie").child(key).remove();

  }

  render() {
    return (
      <div className="Core">
        <div className="StepFinder">
          <StepFinder addEtape={this.addEtape} lastDate={this.lastDate} />
        </div>
        <SplitPane
          split="vertical"
          allowResize={true}
          defaultSize="50%"
          resizerStyle={stylesSpliter}
        >
          <Pane className="CarteList">
            <ListEtape
              listV={this.state.activities}
              selectEtape={this.selectEtape}
              deleteActivity={this.deleteActivity}
              setCalculatedDirection={this.setCalculatedDirection}
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
            {<Carte
              mapKey={this.state.mapKey}
              activitiesList={this.state.activities}
              focusOnPolylineId={this.state.focusOnPolylineId}
              center={this.state.position}
              zoom={this.state.zoom}
            />}
          </Pane>
        </SplitPane>
      </div>
    );
  }
}


export default Core;
