import React from 'react';
import './core.css'
import {database} from "../firebase.js";
import { get, ref, push, update, child, remove } from "firebase/database";
import Menu from './Menu';
import ActivitiesCalendar from './calendar/ActivitiesCalendar';
import Carte from './space/Carte';
import {Row, Col} from "antd";
import { UserContext } from "./auth/UserContext"
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import customSameOrBefore from 'dayjs/plugin/isSameOrBefore';

const db = database;
dayjs.extend(customParseFormat);
dayjs.extend(customSameOrBefore);

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
      poiData: {types : []}
    };

    this.addEtape = this.addEtape.bind(this);
    this.selectEtape = this.selectEtape.bind(this);
    this.deleteActivity = this.deleteActivity.bind(this);
    this.loadActivitiesFromDb = this.loadActivitiesFromDb.bind(this);
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
          tripsFromDb.push({key : trip.key, name : tripValue.name, dateRange : tripValue.dateRange.map(dr => dayjs(dr,"YYYY-MM-DD"))});
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
    
    console.log("Chargement des données de la base");
    
    get(ref(db,`${this.state.userUid}/${tripKey}/activities`)).then((snapshot) => {
      if (snapshot.exists()) {
        
        var activitiesConverted = [];
        snapshot.forEach((activity) => {
          //Ajout et convertion des activité de la base
          var activityFromDb = activity.val();
          activityFromDb.key = activity.key;
          activityFromDb.startDate = dayjs(activityFromDb.startDate, "YYYY-MM-DDTHH:mm");
          if(activityFromDb.endDate){
            activityFromDb.endDate = dayjs(activityFromDb.endDate, "YYYY-MM-DDTHH:mm");
          }
          activitiesConverted.push(activityFromDb);
          
        })

        console.log('Loaded activities', activitiesConverted)
        this.setState({ activities: activitiesConverted});
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    
  }

  //#################    CREATE / UPDATE     ###################


  //Créer le nouveau trip
  //FIXME : SUr l'ajout d'un nouveau trip le calendrier ne se met pas à jours
  createNewTrip(newTrip){
    console.log("Création / update du trip: " + newTrip.name);
    
    let newTripToSave = {
      name : newTrip.name,
      dateRange : newTrip.dateRange,
    };
    
    //Copy pour le formatage des dates
    var newTripToSaveDb = Object.assign({},newTripToSave);
    newTripToSaveDb.dateRange = newTripToSaveDb.dateRange.map(t => t.toISOString());

    console.log(newTripToSaveDb);

    let trips = this.state.trips;
    
    const tripRef  = ref(db,`${this.state.userUid}/`);
    if(newTrip.key === 0){
      const newEntry = push(tripRef, newTripToSaveDb);
      newTripToSave.key = newEntry.key;
      //Ajout du nouveau trip
      trips.push(newTripToSave);
      this.setState({selectedTrip: newTripToSave,trips : trips});
    }else{
      update(ref(db,`${this.state.userUid}/${newTrip.key}`), newTripToSaveDb);
      let tripToUpdate = trips.find(t => t.key === newTrip.key);
      newTripToSave.key = newTrip.key;
      Object.assign(tripToUpdate, newTripToSave);
      this.setState({selectedTrip: newTripToSave,trips : trips});
      this.removeOutOfRangeActivities();
    }
    //On ajoute la clef qui vient d'être sauvegardé
 
  }

 /* Ajoute ou met à jour l'étape remontée par le composant Finder à la liste*/
  addEtape(etape) {
    console.log("Sauvergarde etape key (0 pour une nouvelle étape): " + etape.key);
    
    var activityForDb = Object.assign({},etape);
    //TODO : faire une fonction utils pour formater les dates
    activityForDb.startDate = activityForDb.startDate.toISOString();
    if(activityForDb.endDate !== null){
      activityForDb.endDate = activityForDb.endDate.toISOString();
    }

    // Formatage des direction result pour pouvoir etre chagé en base
    if(activityForDb.route !== null && activityForDb.route !== undefined){ 
      activityForDb.route = JSON.parse( JSON.stringify(activityForDb.route));
    }
    //on récupére la liste pour la modifier
    var listLocal = this.state.activities;
    
    //sauvegarde de l'étape en base. Si la clef est 0, c'est une nouvelle étape
  
    const activitiesRef  = ref(db,`${this.state.userUid}/${this.state.selectedTrip.key}/activities`);
    if(etape.key === 0){
      const newEntry = push(activitiesRef, activityForDb);
      etape.key = newEntry.key;
      
      //Ajout de l'étape dans la liste avec la nouvelle clef
      listLocal.push(etape);
    }else{ //mise à jour de l'étape en base
      update(child(activitiesRef, etape.key), activityForDb);
        
      //Mise à jour de l'oject dans la liste
      let activityToUpdate = listLocal.find((act) => etape.key === act.key);    
      Object.assign(activityToUpdate, etape)
    }
    
    this.setState({ activities: listLocal });
    
    this.selectEtape(etape.key)
    //FIXE ME : Ca fait 2 Set Sate c'est ultra couteu : 
    //On centre la carte sur la nouvelle étape si ce n'est pas une day activity
    /* if(etape.activityType !== 'day')
    this.selectEtape(etape.key); */
    
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
    this.setState({ activities: listLocal });
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
    this.setState({ activities: listLocal });
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
    this.setState({ activities: activitiesTarget });
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
  removeOutOfRangeActivities(){
    
    const debut = this.state.selectedTrip.dateRange[0];
    const fin = this.state.selectedTrip.dateRange[1];
    
    console.log('debut',debut);
    console.log('fin',fin);
    var day = debut;
    console.log('day',day);
    //Liste des jour compris dans la période
    var periodeList = [];
    
    while(day.isSameOrBefore(fin)){
      periodeList.push(day);
      console.log('day',day);
      day = day.add(1, 'day');
    }
    
    console.log(periodeList);
    
    //Suppression de toutes les activités hors période !!!! WARNING : ca peut tout niquer en 2 2 !!!!
    var activitiesKeysToDelete = [];
    for(const act of this.state.activities){
      if(periodeList.find((d) => d.isSame(act.startDate, 'day'))===undefined){
        activitiesKeysToDelete.push(act.key)
      }
    }
    
    this.deleteActivities(activitiesKeysToDelete);
     
  }
  
  /* Déclanchement de la sélection d'un étape */
  selectEtape = (idEtape) => {
    let selectionList = [];
    // Map et non mutable, il n'affecte pasle state
    selectionList = this.state.activities.map( a => { a.selected = false; return a; }  )
    //Find est mutable ca met à jour tout seul
    selectionList.find((k) => k.key === idEtape).selected = true;
    this.setState({ activities: selectionList });
  }
      
  handleTripSelection(selectedTripKey){
    const selectedTrip = this.state.trips.find(a => a.key === selectedTripKey);
    console.log("Trip seected : " + selectedTrip.name)
    this.setState({selectedTrip: selectedTrip});
    this.loadActivitiesFromDb(selectedTrip.key);
  }
  
  displayPoiData = (poiData) => {
    this.setState({poiData : poiData});
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
            />
 
        {this.state.selectedTrip !== null ? (
        <Row>
          <Col span={14}>
            <ActivitiesCalendar
              selectedTrip={this.state.selectedTrip}
              activities={this.state.activities}
              addEtape={this.addEtape}
              deleteActivity={this.deleteActivity}
              selectEtape={this.selectEtape}
            />
          </Col>
          <Col span={10}>
            <Carte
              activitiesList={this.state.activities}
              displayPoiData={this.displayPoiData}
            />
            <div>
              Adresse : {this.state.poiData.formatted_address}
              Type : {this.state.poiData.types[0]}
            </div>
          </Col>
        </Row>
        ):''}
      </div>
    );
  }
}


export default Core;
