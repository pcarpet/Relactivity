import React from 'react';
import './core.scss'
import firebase from "../firebase.js";
import moment from "moment";
import TripList from './TripList';
import Periode from './Periode';
import ListEtape from './time/ListEtape';
import Carte from './space/Carte';
import {Row, Col} from "antd";



const db = firebase.database();

//const trip = "lombardie";
//const trip = "cotedor";


class Core extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      loading: false,
      trips: [],
      selectedTrip: null,
      activities: [],
      defaultPickerValue : [moment("2021-12-23","YYYY-MM-DD"), moment("2021-12-27","YYYY-MM-DD")],
    };

    this.addEtape = this.addEtape.bind(this);
    this.selectEtape = this.selectEtape.bind(this);
    this.deleteActivity = this.deleteActivity.bind(this);
    this.loadActivitiesFromDb = this.loadActivitiesFromDb.bind(this);
    this.refreshActivities = this.refreshActivities.bind(this);
    this.getDefaultPickerValue = this.getDefaultPickerValue.bind(this);
    this.updateListOfDays = this.updateListOfDays.bind(this);
    this.handleTripSelection = this.handleTripSelection.bind(this);
    this.createNewTrip = this.createNewTrip.bind(this);
    this.deleteTrip = this.deleteTrip.bind(this);
    this.deleteActivityByDateAndType = this.deleteActivityByDateAndType.bind(this);

  }


  componentDidMount() {
    this.loadTripsFromDb(); 
  }
  
  loadTripsFromDb(){
    this.setState({loading : true});
    let tripsFromDb = [];
    db.ref("activities/pca").get().then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach(activity => {
          tripsFromDb.push(activity.key);
        });
      }
      
      console.log(tripsFromDb);

      this.setState({trips:tripsFromDb});
      this.setState({selectedTrip:tripsFromDb[0]});
      
      this.loadActivitiesFromDb(tripsFromDb[0]);
      this.setState({loading : false});
    });
  }
  
  //Chargement des donnée de la base
  loadActivitiesFromDb(tripKey){
    
    //  console.log("Chargement des données de la base");
    
    db.ref("activities/pca/" + tripKey).get().then((snapshot) => {
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
    
    //Ajout des activités pour les jours manquant (activité fictive)
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
  
  /* Ajoute ou met à jour l'étape remontée par le composant Finder à la liste*/
  addEtape(etape) {
    console.log("Sauvergarde etape key (0 pour une nouvelle étape): " + etape.key);
    
    var activityForDb = Object.assign({},etape);
    //TODO : faire une fonction utils pour formater les dates
    activityForDb.date = activityForDb.date.format("YYYY-MM-DD");
    if(activityForDb.heure !== null){
      activityForDb.heure = activityForDb.heure.format("HH:mm");
    }
    // Formatage des direction result pour pouvoir etre chagé en base
    if(activityForDb.route !== null && activityForDb.route !== undefined){ 
      activityForDb.route = JSON.parse( JSON.stringify(activityForDb.route));
    }
    //on récupére la liste pour la modifier
    var listLocal = this.state.activities;
    
    //sauvegarde de l'étape en base. Si la clef est 0, c'est une nouvelle étape
    if(etape.key === 0){
      const activitiesRef  = db.ref("activities/pca/" + this.state.selectedTrip);
      const newEntry = activitiesRef.push(activityForDb);
      etape.key = newEntry.key;
      
      //Ajout de l'étape dans la liste avec la nouvelle clef
      listLocal.push(etape);
    }else{ //mmise à jour de l'étape en base
      db.ref("activities/pca/" + this.state.selectedTrip).child(etape.key).update(activityForDb)
      
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
      
    //On filtre la liste d'activité pour retirer la key de l'activité à supprimer
    listLocal = listLocal.filter(e => e.key !== key);
      
    //Supression en base
    db.ref("activities/pca/" + this.state.selectedTrip).child(key).remove();
     
    //Mise à jour du state
    this.refreshActivities(listLocal);
  }
    
  //Obligé de faire une fonction multiple car le setState de la liste des activité dans le refresh ne la met pas à jour et les élements supprimés reviennent
  deleteActivities(keys){
    console.log("Supression des étape key : " + keys);
    //Supression en base
    for(const key of keys){
      db.ref("activities/pca/" + this.state.selectedTrip).child(key).remove();
    }
    
    var listLocal = this.state.activities;
    
    //On filtre la liste d'activité pour retirer la key de l'activité à supprimer
    listLocal = listLocal.filter(e => !keys.includes(e.key));
    
    //Mise à jour du state
    this.refreshActivities(listLocal);
  }
  
   deleteActivityByDateAndType(etapeDay, timeOfDay){
    console.log("Supression de l'étape du : " + etapeDay.format("DD/MM/YY") + " de type : " + timeOfDay);
    
    //On filtre la liste d'activité pour retrouver les activités à supprimer: normalement il ne devrait y en avoir qu'une
    const activityKeysToDelete = this.state.activities
                                      .filter(e => e.date.isSame(etapeDay, 'day') && e.activityType === timeOfDay)
                                      .map(e => e.key);
    
    //Supression en base
    for(const activityKey of activityKeysToDelete){
      console.log("Supression de l'activité : " + activityKey);
      db.ref(`activities/pca/${this.state.selectedTrip}`).child(activityKey).remove();
    } 
    
    //On vire les activité supprimé
    const activitiesTarget = this.state.activities.filter(e => !activityKeysToDelete.includes(e.key));;
    //Mise à jour du state
    this.refreshActivities(activitiesTarget);
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
    
  }
      
  handleTripSelection(selectedTrip){
    console.log("Chargement des activités pour :" + selectedTrip);
    this.setState({selectedTrip: selectedTrip});
    this.loadActivitiesFromDb(selectedTrip);
  }
  
  createNewTrip(newTrip){
    let trips = this.state.trips;
    trips.push(newTrip);
    this.setState({ 
      selectedTrip: newTrip,
      trips : trips,
      activities: [] ,
    });
    this.getDefaultPickerValue();
  }

  deleteTrip(){
    
    const tripToDelete = this.state.selectedTrip;

    //Supression de la base
    db.ref("activities/pca/" + tripToDelete).remove();
    let trips = this.state.trips;
    trips = trips.filter(t => t !== tripToDelete);

    this.setState({ 
      trips : trips,
    });

    if(trips[0] !== undefined)
      this.handleTripSelection(trips[0]);
  }
    
  render() {
      return (
        <div className="Core">
        <Row>
          <Col>
            {this.state.loading ? "LOADING......" : ''}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <TripList 
              selectedTrip={this.state.selectedTrip}
              handleTripSelection={this.handleTripSelection}
              trips={this.state.trips}
              createNewTrip={this.createNewTrip}
              deleteTrip={this.deleteTrip}
            />
          </Col>
  
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
              deleteActivityByDateAndType={this.deleteActivityByDateAndType}
              addEtape={this.addEtape}
            />
          </Col>
          <Col span={8}>
            <Carte
              activitiesList={this.state.activities.filter(a => a.activityType !== 'day')}
            />
          </Col>
        </Row>
      </div>
    );
  }
}


export default Core;
