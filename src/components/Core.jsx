import React from 'react';
import './core.css'
import {database} from "../firebase.js";
import { get, ref, push, update, child, remove } from "firebase/database";
import moment from "moment";
import Menu from './Menu';
import TimeLine from './time/TimeLine';
import ActivitiesCalendar from './calendar/ActivitiesCalendar';
import Carte from './space/Carte';
import {Row, Col} from "antd";
import { UserContext } from "./auth/UserContext"
import { ThemeConsumer } from 'styled-components';

const db = database;

class Core extends React.Component {
  
  static contextType = UserContext;
  
  constructor(props, context) {
    super(props);

    this.state = {
      userUid: context.currentUser.uid,
      loading: false,
      trips: [],
      selectedTrip: null, //{key : null, name: null, dateRange: []}
      activities: [],
    };

    this.addEtape = this.addEtape.bind(this);
    this.selectEtape = this.selectEtape.bind(this);
    this.deleteActivity = this.deleteActivity.bind(this);
    this.loadActivitiesFromDb = this.loadActivitiesFromDb.bind(this);
    this.refreshActivities = this.refreshActivities.bind(this);
    this.updateListOfDays = this.updateListOfDays.bind(this);
    this.handleTripSelection = this.handleTripSelection.bind(this);
    this.createNewTrip = this.createNewTrip.bind(this);
    this.deleteTrip = this.deleteTrip.bind(this);
    this.deleteActivityByDateAndType = this.deleteActivityByDateAndType.bind(this);

  }


  componentDidMount() {
    this.loadTripsFromDb();
  }
  

  //################################################################
  //####### !!!!!!!  DATABASE OPERATION  !!!!!!!!!!  ###############
  //################################################################

  //#################    READ     ###################

  loadTripsFromDb(){

    this.setState({loading : true});
    let tripsFromDb = [];
    get(ref(db,`${this.state.userUid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach(trip => {
          let tripValue = trip.val();
          tripsFromDb.push({key : trip.key, name : tripValue.name, dateRange : tripValue.dateRange.map(dr => moment(dr,"YYYY-MM-DD"))});
        });
      }else{
        console.log("No data available");
      }
      
      console.log(tripsFromDb);

      if(tripsFromDb.length > 0){
        this.setState({trips:tripsFromDb, selectedTrip:tripsFromDb[0]});
        this.loadActivitiesFromDb(tripsFromDb[0].key);
      }

      this.setState({loading : false});
    });
  }
  
  //Chargement des donnée de la base
  loadActivitiesFromDb(tripKey){
    
    //  console.log("Chargement des données de la base");
    
    get(ref(db,`${this.state.userUid}/${tripKey}/activities`)).then((snapshot) => {
      if (snapshot.exists()) {
        
        var activitiesConverted = [];
        snapshot.forEach((activity) => {
          //Ajout et convertion des activité de la base
          var activityFromDb = activity.val();
          activityFromDb.key = activity.key;
          activityFromDb.startDate = moment(activityFromDb.startDate, "YYYY-MM-DDTHH:mm");
          if(activityFromDb.endDate){
            activityFromDb.endDate = moment(activityFromDb.endDate, "YYYY-MM-DDTHH:mm");
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

  //#################    CREATE / UPDATE     ###################


  //Créer le nouveau trip
  //FIXME : A mon avis si tu met des caracétre de merde dans le nom du trip ca foire
  createNewTrip(newTrip){
    console.log("Création du trip: " + newTrip.tripName);
    console.log(newTrip.dateRange);
    
    let newTripToSave = {
      name : newTrip.tripName,
      dateRange : newTrip.dateRange,
      activities : [],
    };
    
    //Copy pour le formatage des dates
    var newTripToSaveDb = Object.assign({},newTripToSave);
    newTripToSaveDb.dateRange = newTripToSaveDb.dateRange.map(t => t.format("YYYY-MM-DD"));

    const activitiesRef  = ref(db,`${this.state.userUid}/`);
    const newEntry = push(activitiesRef, newTripToSaveDb);
    
    //On ajoute la clef qui vient d'être sauvegardé
    newTripToSave.key = newEntry.key;

    //Ajout du nouveau trip
    let trips = this.state.trips;
    trips.push(newTripToSave);
    this.setState({
          selectedTrip: newTripToSave,
          trips : trips,
          activities: [],
        });
  }

  // TODO : faire l'implem
  updateTrip(dateRange){
    //this.setState({dateRangeLimit: range});
  }


 /* Ajoute ou met à jour l'étape remontée par le composant Finder à la liste*/
  addEtape(etape) {
    console.log("Sauvergarde etape key (0 pour une nouvelle étape): " + etape.key);
    
    var activityForDb = Object.assign({},etape);
    //TODO : faire une fonction utils pour formater les dates
    activityForDb.startDate = activityForDb.startDate.format("YYYY-MM-DDTHH:mm");
    if(activityForDb.endDate !== null){
      activityForDb.endDate = activityForDb.endDate.format("YYYY-MM-DDTHH:mm");
    }

    // Formatage des direction result pour pouvoir etre chagé en base
    if(activityForDb.route !== null && activityForDb.route !== undefined){ 
      activityForDb.route = JSON.parse( JSON.stringify(activityForDb.route));
    }
    //on récupére la liste pour la modifier
    var listLocal = this.state.activities;
    
    //sauvegarde de l'étape en base. Si la clef est 0, c'est une nouvelle étape
    if(etape.key === 0){
      const activitiesRef  = ref(db,`${this.state.userUid}/${this.state.selectedTrip}/activities`);
      const newEntry = push(activitiesRef, activityForDb);
      etape.key = newEntry.key;
      
      //Ajout de l'étape dans la liste avec la nouvelle clef
      listLocal.push(etape);
    }else{ //mise à jour de l'étape en base
      update(child(ref(db,`${this.state.userUid}/${this.state.selectedTrip}/activities`), etape.key), activityForDb);
        
      //Mise à jour de l'oject dans la liste
      let activityToUpdate = listLocal.find((act) => etape.key === act.key);    
      Object.assign(activityToUpdate, etape)
    }
    
    
    this.refreshActivities(listLocal);
    
    //FIXE ME : Ca fait 2 Set Sate c'est ultra couteu : 
    //On centre la carte sur la nouvelle étape si ce n'est pas une day activity
    /* if(etape.activityType !== 'day')
    this.selectEtape(etape.key); */
    
  }

  updateTripName(oldName, newName) {

  }

  //#################    DELETE     ###################

  deleteActivity(key){
    console.log("Supression de l'étape key : " + key);
    var listLocal = this.state.activities;
      
    //On filtre la liste d'activité pour retirer la key de l'activité à supprimer
    listLocal = listLocal.filter(e => e.key !== key);
      
    //Supression en base
    remove(child(ref(db,`${this.state.userUid}/${this.state.selectedTrip.key}/activities`),key));
     
    //Mise à jour du state
    this.refreshActivities(listLocal);
  }
    
  //Obligé de faire une fonction multiple car le setState de la liste des activité dans le refresh ne la met pas à jour et les élements supprimés reviennent
  deleteActivities(keys){
    console.log("Supression des étape key : " + keys);
    //Supression en base
    for(const key of keys){
      remove(child(ref(db,`${this.state.userUid}/${this.state.selectedTrip.key}/activities`),key));
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
      remove(child(ref(db,`${this.state.userUid}/${this.state.selectedTrip.key}/activities`),activityKey));
    } 
    
    //On vire les activité supprimé
    const activitiesTarget = this.state.activities.filter(e => !activityKeysToDelete.includes(e.key));;
    //Mise à jour du state
    this.refreshActivities(activitiesTarget);
  }

  deleteTrip(){
    
    //On supprime le trip courant
    const tripToDelete = this.state.selectedTrip.key;

    //Supression de la base
    remove(ref(db,`${this.state.userUid}/${tripToDelete}`));
    let trips = this.state.trips;
    trips = trips.filter(t => t.key !== tripToDelete);

    this.setState({ 
      trips : trips,
    });

    if(trips[0] !== undefined)
      this.handleTripSelection(trips[0]);
  }


  //################################################################
  //####### !!!!  ACTITIVIES MANIPULATIONS  !!!!!!!  ###############
  //################################################################

  
  
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
   /*  var newDates = [];
    for(const d of periodeList){
      if(this.state.activities.find((activities) => activities.startDate.isSame(d, 'day'))===undefined){
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
     */
    
    //Suppression de toutes les activités hors période !!!! WARNING : ca peut tout niquer en 2 2 !!!!
    var activitiesKeysToDelete = [];
    for(const act of this.state.activities){
      if(periodeList.find((d) => d.isSame(act.startDate, 'day'))===undefined){
        activitiesKeysToDelete.push(act.key)
      }
    }
    this.deleteActivities(activitiesKeysToDelete);
    
    
  }
  
  //Retrie les activité par date et set la liste
  //TODO : le truc ne sert plus à rien
  refreshActivities(listLocal){
    
    //Tri des étapes par chronologie
   /*  listLocal.sort(function (a, b) {
      return a.startDate - b.startDate;
    }); */
    //Recalcul du rank (ben c'est mieu que la position dans un array)
    //Le rank commence à 1
   /*  for (var i = 0; i < listLocal.length; i++) {
      listLocal[i].rank = i + 1;
    } */
    
    console.log(listLocal);
    this.setState({ activities: listLocal });
    
    //this.updateDateRangeLimit();
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
    this.setState({ activities: selectionList });
  }
      
  handleTripSelection(selectedTrip){
    console.log("Chargement des activités pour :" + selectedTrip.name);
    this.setState({selectedTrip: selectedTrip});
    this.loadActivitiesFromDb(selectedTrip.key);
  }
  
 

    
  render() {
      return (
        <div className="core">
        <Row>
          <Col>
            {this.state.loading ? "LOADING......" : ''}
          </Col>
        </Row>
        <Menu 
             selectedTrip={this.state.selectedTrip}
             trips={this.state.trips}
             handleTripSelection={this.handleTripSelection}
             createNewTrip={this.createNewTrip}
             deleteTrip={this.deleteTrip}
             //updateDefaultPickerValue={this.updateDateRangeLimit}
             updateListOfDays={this.updateListOfDays}
            />
 
        {this.state.selectedTrip !== null ? (
        <Row>
          <Col span={16}>
            <ActivitiesCalendar
              dateRange={this.state.selectedTrip.dateRange}
              activities={this.state.activities}
              addEtape={this.addEtape}
              deleteActivity={this.deleteActivity}
            />
           {/*  <TimeLine
              activities={this.state.activities}
              selectEtape={this.selectEtape}
              deleteActivity={this.deleteActivity}
              deleteActivityByDateAndType={this.deleteActivityByDateAndType}
              addEtape={this.addEtape}
            /> */}
          </Col>
          <Col span={8}>
            {/* <Carte
              activitiesList={this.state.activities.filter(a => a.activityType !== 'day')}
            /> */}
          </Col>
        </Row>
        ):''}
      </div>
    );
  }
}


export default Core;
