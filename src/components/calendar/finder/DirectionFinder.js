/* eslint-disable no-undef */
import React, { useState } from "react";
import "./finder.css"
import {TimePicker, Form, Input, Radio } from "antd";
import Emoji from "a11y-react-emoji";
import PlaceAutocompleteInput from "./PlaceAutocompleteInput";
import dayjs from "dayjs";

function DirectionFinder (props) {

  const [addressStartSearched, setAddressStartSearched] = useState(props.isModify ? props.activityToModify.origin.googleFormattedAddress : '');
  const [addressEndSearched, setAddressEndSearched] = useState(props.isModify ? props.activityToModify.destination.googleFormattedAddress : '');
  const [placeStartFound, setPlaceStartFound] = useState({});
  const [placeEndFound, setPlaceEndFound] = useState({});
  const [messageErreur, setMessageErreur] = useState();

//############### Initialisation du formulaire ########################

  const initFormValue = (props) => {
    let initvalue = {
      travelMode : 'walk',
      heureDebut: props.isModify ? props.activityToModify.startDate : dayjs(props.eventToCreate.startStr),
      heureFin: props.isModify ? props.activityToModify.endDate : dayjs(props.eventToCreate.endStr),
    }
    if(props.isModify){
      initvalue.nomEtape = props.activityToModify.nomEtape;
      initvalue.travelMode = props.activityToModify.travelModeInputValue;
    }

    return initvalue;
  }
    

  //############### Gestion des Inputs ########################
  
  //Appeler en callback par le Google place autocomplete
  const handleStartFound = (placeFound) => {
    setPlaceStartFound(placeFound);
  };
  const handleEndFound = (placeFound) => {
    setPlaceEndFound(placeFound);
  };

  //Appeler en callback par le Place autcomplete pour prendre la valeur saisie
  const handlePlaceStartInputValue = (value) => {
    setAddressStartSearched(value);
  };
  
  //Appeler en callback par le Place autcomplete pour prendre la valeur saisie
  const handlePlaceEndInputValue = (value) => {
    setAddressEndSearched(value);
  };


//############### Validation ########################

  /* Validation du formulaire */
  const onFinish = async (formValues, props) => {
    
    setMessageErreur('');
    props.finderLoading(true);
    
    console.log("Success Formulaire Validé:", formValues);

    const newStartDate = (props.isModify ? props.activityToModify.startDate : dayjs(props.eventToCreate.startStr))
                          .hour(formValues.heureDebut.hour())
                          .minute(formValues.heureDebut.minute());

    const newEndDate = props.isModify ? props.activityToModify.endDate : dayjs(props.eventToCreate.endStr)
    .hour(formValues.heureFin.hour())
    .minute(formValues.heureFin.minute());

    //Création du nouvel élément à sauvegarder
    let newItem = {
      key: props.isModify ? props.activityToModify.key : 0,
      type: 'direction',
      startDate: newStartDate,
      endDate: newEndDate,
      nomEtape: formValues.nomEtape || null,
      travelModeInputValue : formValues.travelMode,
      selected: true,
    };

    let startPlaceId = placeStartFound.placeId || null;
    let endPlaceId = placeEndFound.placeId || null;

    //On met à jour le départ si un nouvelle id a ete trouvé
    if(startPlaceId !== null){
      newItem.origin = {
        placeId: startPlaceId,
        addressSearched: addressStartSearched || null,
        googleFormattedAddress: placeStartFound.googleFormattedAddress || null,
        lat: placeStartFound.lat || null,
        long: placeStartFound.lng || null,
      }
    }
    
    //On met à jour l'arrivé si un nouvelle id a ete trouvé
    if(endPlaceId !== null){
      newItem.destination = {
        googleFormattedAddress: placeEndFound.googleFormattedAddress || null,
        placeId: endPlaceId,
      }
    }

    //en cas de modification du départ ou de l'arrivée on récupére l'ancien id
    if(props.isModify){
      //Si le départ est modifié et pas la destination
      if(startPlaceId !== null && endPlaceId == null){
        //On reprend l'ancien id de la destination pour l'itinéraire
        endPlaceId = props.activityToModify.destination.placeId;
      }
      //Si la destination est modifié et pas le départ
      if(startPlaceId == null && endPlaceId !== null){
        //On reprend l'ancien id de départ
        startPlaceId = props.activityToModify.origin.placeId;
      }

      //Si on change uniquement le travelmode
      if(endPlaceId == null && startPlaceId == null && formValues.travelMode !== props.activityToModify.travelModeInputValue){
        //On reprend l'ancien id de départ
        startPlaceId = props.activityToModify.origin.placeId;
        endPlaceId = props.activityToModify.destination.placeId;
      }

    }
    
    
    // Récupération de l'itinéraire
    let route = null;
    if(startPlaceId !== null && endPlaceId !== null){
      route = await getDirection(formValues.travelMode, startPlaceId, endPlaceId, newStartDate)
                            .catch(e => {setMessageErreur('Itinéraire introuvable!'); throw e;});
      newItem.route = route || null;
    }else if(props.isModify){
      console.log("Pas de recalcul de l'itinétaire");
    }else{
      console.error("Départ et / ou arrivée non renseignés");
    }
 
    //Callback pour ajout de l'étape
    props.addEtape(newItem);
    props.finderLoading(false);   

    //Réinitialisation
    setAddressStartSearched('');
    setAddressEndSearched('');
    setPlaceStartFound('');
    setPlaceEndFound('');
    setMessageErreur('');

    props.closeModal();

  };

  // Appel au service google de direction pour retrouver le polyline d'itiniéraire
  const getDirection = (travelModeInput, startPlaceId, endPlaceId, dateTime) => {

    let travelMode;
    let transitOptions;
    switch(travelModeInput){
      case 'walk':
        travelMode = google.maps.TravelMode.WALKING;
        break;
      case 'bicycling':
        travelMode = google.maps.TravelMode.BICYCLING;
        break;
      case 'drive':
        travelMode = google.maps.TravelMode.DRIVING;
        break;
      case 'train':
        travelMode = google.maps.TravelMode.TRANSIT;
        transitOptions = {
          departureTime: dateTime.toDate(),
          modes: [google.maps.TransitMode.TRAIN],
          routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS,
        }
        break;
      default:
        console.error(`Sorry, ${travelMode} is not a supported travel mode.`);
    }

      const directionsService = new google.maps.DirectionsService();

      const request = {
          origin: {placeId : startPlaceId},
          destination: {placeId: endPlaceId},
          travelMode: travelMode,
          transitOptions: transitOptions,
      }

      console.log("Appel du service Route...");
      return directionsService.route(request);
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  

  return (
    <div className="step-finder-main">
      <Form
        id="directionfinder"
        name="AjoutDirection"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={(values) => onFinish(values, props)}
        onFinishFailed={onFinishFailed}
        requiredMark={true}
        initialValues={initFormValue(props)}
      >
            <Form.Item
              label="Description"
              name="nomEtape"
              rules={[
                { required: true, message: "Donne un nom à ton étape" },
              ]}
              
            >
              <Input type="text" />
            </Form.Item>
        
            
              <Form.Item name="travelMode" defaultValue="walk">
              <Radio.Group>
                <Radio.Button value="walk">
                  <Emoji symbol="🚶" label="walk" />
                </Radio.Button>
                <Radio.Button value="bicycling">
                  <Emoji symbol="🚴🏻‍♀️" label="bicycling" />
                </Radio.Button>
                <Radio.Button value="drive">
                  <Emoji symbol="🚗" label="drive" />
                </Radio.Button>
                <Radio.Button value="train">
                  <Emoji symbol="🚄" label="train" />
                </Radio.Button>
                {/* <Radio.Button value="plane">
                  <Emoji symbol="✈️" label="plane" />
                </Radio.Button> */}
              </Radio.Group>
            </Form.Item>


            <div>Départ :</div>
            <PlaceAutocompleteInput             
              value={addressStartSearched}
              handlePlaceFound={handleStartFound}
              handlePlaceInputValue={handlePlaceStartInputValue}
            />
            
            <Form.Item label="Heure départ" name="heureDebut">
              <TimePicker minuteStep={5} format="HH:mm" />
            </Form.Item>
            
            <div>Arrivée :</div>
            <PlaceAutocompleteInput             
              value={addressEndSearched}
              handlePlaceFound={handleEndFound}
              handlePlaceInputValue={handlePlaceEndInputValue}
            />
            
            <Form.Item label="Heure arrivée" name="heureFin">
              <TimePicker minuteStep={5} format="HH:mm" />
            </Form.Item>
            <div className="error">{messageErreur}</div>

      </Form>
    </div>
  );
}

export default DirectionFinder;
