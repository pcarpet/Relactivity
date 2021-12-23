import React from 'react';
import './core.scss'
import firebase from "../firebase.js";
import moment from "moment";
import Periode from './Periode';
import ListEtape from './time/ListEtape';
import Carte from './space/Carte';
import {Row, Col} from "antd";


const db = firebase.database();

//const trip = "lombardie";
const trip = "cotedor";

class Core extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      activities: [],
      defaultPickerValue : [moment("2021-12-23","YYYY-MM-DD"), moment("2021-12-27","YYYY-MM-DD")],
      focusOnPolylineId: undefined,
      mapKey: 0,
      position: [48.85, 2.33],
      zoom: 11
    };

    this.addEtape = this.addEtape.bind(this);
    this.selectEtape = this.selectEtape.bind(this);
    this.deleteActivity = this.deleteActivity.bind(this);
    this.setCalculatedDirection = this.setCalculatedDirection.bind(this);
    this.loadActivitiesFromDb = this.loadActivitiesFromDb.bind(this);
    this.refreshActivities = this.refreshActivities.bind(this);
    this.getDefaultPickerValue = this.getDefaultPickerValue.bind(this);
    this.updateListOfDays = this.updateListOfDays.bind(this);

  }


  componentDidMount() {
    this.loadActivitiesFromDb();

  }


  //Chargement des donnée de la base
  loadActivitiesFromDb(){
    
  //  console.log("Chargement des données de la base");
    
    db.ref("activities/pca/" + trip).get().then((snapshot) => {
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
  
  // retrouve la date la plus ancienne et la plus récente de la liste d'activité
  getDefaultPickerValue(){
    var allDates = [];
    allDates = this.state.activities.map((act) => act.date);

    const maxDate = moment.max(allDates);
    const minDate = moment.min(allDates);
    
    const range = [minDate, maxDate];

    this.setState({defaultPickerValue: range});
  }

  // On s'assure que la liste contient des activités pour les jours de la période (création d'activités fictives)
  // On va supprimmer toutes les activités liés au jours hors de la période !!!
  updateListOfDays(dateRange){

      const debut = dateRange[0];
      const fin = dateRange[1];

      console.log(debut);

      var day = debut.clone();
      var periodeList = [];

      while(day.isSameOrBefore(fin)){
        periodeList.push(day.clone());
        day.add(1, 'days');
      }
      
      console.log(periodeList);
      
      //Ajout des activité pour les jours manquant (activité fictive)
      var newDates = [];
      for(const d of periodeList){
        if(this.state.activities.find((activities) => activities.date.isSame(d, 'day'))===undefined){
          newDates.push(d);
        }
      }
      
      console.log(newDates);
      
      for(const nd of newDates){
        var dayActivity = {
          key: 0,
          activityType : 'day',
          date: nd,
          heure: null,
          nomEtape: null,
          //price: formValues.price || null,
          googlePlace: null,
          googlePlaceId: null,
          googleFormattedAdress: null,
          lat: null,
          long: null,
          selected: false,
        };
        this.addEtape(dayActivity);
      }


      //Suppression de toutes les activités hors période !!!! WARNING : ca peut tout niquer en 2 2 !!!!
      var activitiesKeysToDelete = [];
      for(const act of this.state.activities){
          if(periodeList.find((d) => d.isSame(act.date, 'day'))===undefined){
            activitiesKeysToDelete.push(act.key)
          }
        }
        this.deleteActivities(activitiesKeysToDelete);


  }
  
  /* Ajoute l'étape remontée par le composant StepFinder à la liste*/
  addEtape(etape) {
    console.log("Sauvergarde etape key (0 pour une nouvelle étape): " + etape.key);
    
    var activityForDb = Object.assign({},etape);
    //TODO : faire une fonction utils pour formater les dates
    activityForDb.date = activityForDb.date.format("YYYY-MM-DD");
    if(activityForDb.heure !== null){
      activityForDb.heure = activityForDb.heure.format("HH:mm");
    }

    //on récupére la liste pour la modifier
    var listLocal = this.state.activities;

    //sauvegarde de l'étape en base. Si la clef est 0, c'est une nouvelle étape
    if(etape.key === 0){
      const activitiesRef  = db.ref("activities/pca/" + trip);
      const newEntry = activitiesRef.push(activityForDb);
      etape.key = newEntry.key;
      
      //Ajout de l'étape dans la liste avec la nouvelle clef
      listLocal.push(etape);
    }else{ //mmise à jour de l'étape en base
      db.ref("activities/pca/" + trip).child(etape.key).update(activityForDb)
  
      //Mise à jour de l'oject dans la liste
      let activityToUpdate = listLocal.find((act) => etape.key === act.key);    
      Object.assign(activityToUpdate, etape)
    }

  
    this.refreshActivities(listLocal);

    //On centre la carte sur la nouvelle étape si ce n'est pas une day activity
    if(etape.activityType !== 'day')
      this.selectEtape(etape.key);

  }

  deleteActivity(key){
    console.log("Supression de l'étape key : " + key);
    var listLocal = this.state.activities;
    var startActivity = null;
    //On supprime la direction qui meme à cette étape si elle existe
   // const rank = listLocal.find((etape) => etape.key === key).rank;
    //if(rank>1){
    //  startActivity = listLocal.find((etape) => etape.rank === rank-1);
    //  startActivity.directionsResult = null;
    //}

    //On filtre la liste d'activité pour retirer la key de l'activité à supprimer
    listLocal = listLocal.filter(e => e.key !== key);
    
    //FIXME : Si je ne fait pas un setState du Zoom le polyline avec le directionResult ne s'affiche pas sur la carte
    this.setState({ mapKey: this.state.mapKey + 1 });
    
    //Supression en base
    db.ref("activities/pca/" + trip).child(key).remove();
    if(startActivity !== null){
      db.ref("activities/pca/" + trip).child(startActivity.key).update({directionsResult : null});
    }

    //Mise à jour du state
    this.refreshActivities(listLocal);
  }

  //Obligé de faire une fonction multiple car le setState de la liste des activité dans le refresh ne la met pas à jour et les élements supprimés reviennent
  deleteActivities(keys){
    console.log("Supression des étape key : " + keys);
    var listLocal = this.state.activities;
  
    //On filtre la liste d'activité pour retirer la key de l'activité à supprimer
    listLocal = listLocal.filter(e => !keys.includes(e.key));
    
    //FIXME : Si je ne fait pas un setState du Zoom le polyline avec le directionResult ne s'affiche pas sur la carte
    this.setState({ mapKey: this.state.mapKey + 1 });
    
    //Supression en base
    for(const key of keys){
      db.ref("activities/pca/" + trip).child(key).remove();
    }

    //Mise à jour du state
    this.refreshActivities(listLocal);
  }


  //Retrie les activité par date et set la liste
  refreshActivities(listLocal){
   
     //Tri des étapes par chronologie
    listLocal.sort(function (a, b) {
      if (a.date - b.date === 0) { return a.heure - b.heure;};
      return a.date - b.date;
    });
    //Recalcul du rank (ben c'est mieu que la position dans un array)
    //Le rank commence à 1
    for (var i = 0; i < listLocal.length; i++) {
      listLocal[i].rank = i + 1;
    }

    console.log(listLocal);
    this.setState({ activities: listLocal });

    this.getDefaultPickerValue();
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

    //Mise à jour de la base de doonnées
    db.ref("activities/pca/" + trip).child(key).update(
      {directionsResult : JSON.parse( JSON.stringify(directionsResult))}
    );

    //FIXME : Si je ne fait pas un setState du Zoom le polyline avec le directionResult ne s'affiche pas sur la carte
    this.setState({ mapKey: this.state.mapKey + 1 });
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.focusOnPolylineId = undefined;
  }


  render() {
    return (
      <div className="Core">
        <Row>
          <Col span={8}>
            <Periode  
              defaultPickerValue={this.state.defaultPickerValue} 
              updateDefaultPickerValue={this.getDefaultPickerValue}
              updateListOfDays={this.updateListOfDays}
            />
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <ListEtape
              activities={this.state.activities}
              selectEtape={this.selectEtape}
              deleteActivity={this.deleteActivity}
              setCalculatedDirection={this.setCalculatedDirection}
              addEtape={this.addEtape}
            />
          </Col>
          <Col span={8}>
            <Carte
              mapKey={this.state.mapKey}
              activitiesList={this.state.activities.filter(a => a.activityType !== 'day')}
              focusOnPolylineId={this.state.focusOnPolylineId}
              center={this.state.position}
              zoom={this.state.zoom}
            />
          </Col>
        </Row>
      </div>
    );
  }
}


export default Core;
