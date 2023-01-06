/* eslint-disable no-undef */
import React from "react";
import "./finder.css"
import "antd/dist/antd.css";
import moment from "moment";
import {TimePicker, Form, Button, Input, Modal, Radio } from "antd";
import "moment/locale/fr";
import Emoji from "a11y-react-emoji";
import PlaceAutocompleteInput from "./PlaceAutocompleteInput";

class DirectionFinder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalConfirmationLoading : false,
      addressStartSearched: this.props.modalData.isModify ? this.props.modalData.activityToModify.origin.googleFormattedAddress : '',
      addressEndSearched: this.props.modalData.isModify ? this.props.modalData.activityToModify.destination.googleFormattedAddress : '',
      placeStartFound: {
        placeId: null,
        googleFormattedAddress: "",
        lat: null,
        lng: null,
      },
      placeEndFound: {
        placeId: null,
        googleFormattedAddress: "",
        lat: null,
        lng: null,
      },
      messageErreur:'',
    };

    this.handleStartFound = this.handleStartFound.bind(this);
    this.handleEndFound = this.handleEndFound.bind(this);
  }
  
//############### Initialisation du formulaire ########################

  initFormValue(){
    let initvalue = {
      travelMode : 'drive',
    }
    
    if(this.props.modalData.isModify){
      initvalue.nomEtape = this.props.modalData.activityToModify.nomEtape;
      initvalue.heure = this.props.modalData.activityToModify.heure;
      initvalue.travelMode = this.props.modalData.activityToModify.travelModeInputValue;
    }

    return initvalue;
  }
  
  getModalTitle(){
    return "Ajouter un itinéraire  " + this.props.modalData.timeOfDay + " pour le " + this.props.modalData.etapeDay.format("DD/MM/YY") ;
  }

  

  //############### Gestion des Inputs ########################
  
  //Appeler en callback par le Google place autocomplete
  handleStartFound(placeFound){
    this.setState({ placeStartFound: placeFound });
  };
  handleEndFound(placeFound){
    this.setState({ placeEndFound: placeFound });
  };
  
//############### Validation ########################

  /* Validation du formulaire */
  onFinish = async (formValues) => {
    
    this.setState({messageErreur:''})
    this.setState({modalConfirmationLoading : true});
    // Valeur par defaut si non renseigné
    if (this.state.placeStartFound === null) {
      this.setState({placeFound: [{
        address_components: [
          {
            long_name: "Melun",
            short_name: "Melun",
            types: ["locality", "political"],
          },
          {
            long_name: "Seine-et-Marne",
            short_name: "Seine-et-Marne",
            types: ["administrative_area_level_2", "political"],
          },
          {
            long_name: "Île-de-France",
            short_name: "IDF",
            types: ["administrative_area_level_1", "political"],
          },
          {
            long_name: "France",
            short_name: "FR",
            types: ["country", "political"],
          },
          {
            long_name: "77000",
            short_name: "77000",
            types: ["postal_code"],
          },
        ],
        formatted_address: "77000 Melun, France",
        geometry: {
          bounds: {
            south: 48.52352699999999,
            west: 2.628541,
            north: 48.5607479,
            east: 2.6819179,
          },
          location: {
            lat: 48.542105,
            lng: 2.6554,
          },
          location_type: "APPROXIMATE",
          viewport: {
            south: 48.52352699999999,
            west: 2.628541,
            north: 48.5607479,
            east: 2.6819179,
          },
        },
        place_id: "ChIJnwKcN2L65UcRUFSMaMOCCwQ",
        types: ["locality", "political"],
      }]})
    }

    console.log("Ajout d'un itinéraire pour le :", this.props.modalData.etapeDay.format("DD/MM/YYYY"));
    console.log("Success Formulaire Validé:", formValues);
    console.log("GoogleFormattedAddress",this.state.placeStartFound.googleFormattedAddress);

    //Conversion de l'heure en moment
    const heure = formValues.heure === undefined ? null : (formValues.heure === null ? null : moment(formValues.heure.format("HH:mm"), "HH:mm"));
    let dateTimeStg = this.props.modalData.etapeDay.format("YYYYMMDD");
    if(heure !== null) dateTimeStg = dateTimeStg.concat('T', heure.format("HHmm"));
    const dateTime = moment(dateTimeStg);
    console.log(dateTime);

    //Création du nouvel élément à sauvegarder
    let newItem = {
      key: this.props.modalData.isModify ? this.props.modalData.activityToModify.key : 0,
      activityType : this.props.modalData.timeOfDay,
      date: this.props.modalData.etapeDay,
      heure: heure,
      nomEtape: formValues.nomEtape || null,
      travelModeInputValue : formValues.travelMode,
      selected: true,
    };

    let startPlaceId = this.state.placeStartFound.placeId;
    let endPlaceId = this.state.placeEndFound.placeId;


    //On met à jour le départ si un nouvelle id a ete trouvé
    if(startPlaceId !== null){
      newItem.origin = {
        placeId: startPlaceId,
        addressSearched: this.state.addressStartSearched || null,
        googleFormattedAddress: this.state.placeStartFound.googleFormattedAddress || null,
        lat: this.state.placeStartFound.lat || null,
        long: this.state.placeStartFound.lng || null,
      }
    }
    
    //On met à jour le départ si un nouvelle id a ete trouvé
    if(endPlaceId !== null){
      newItem.destination = {
        googleFormattedAddress: this.state.placeEndFound.googleFormattedAddress || null,
        placeId: endPlaceId,
      }
    }

    //en cas de modification du départ ou de l'arrivée on récupére l'ancien id
    if(this.props.modalData.isModify){
      //Si le départ est modifié et pas la destination
      if(startPlaceId !== null && endPlaceId == null){
        //On reprend l'ancien id de la destination pour l'itinéraire
        endPlaceId = this.props.modalData.activityToModify.destination.placeId;
      }
      //Si la destination est modifié et pas le départ
      if(startPlaceId == null && endPlaceId !== null){
        //On reprend l'ancien id de départ
        startPlaceId = this.props.modalData.activityToModify.origin.placeId;
      }

      //Si on change uniquement le travelmode
      if(endPlaceId == null && startPlaceId == null && formValues.travelMode !== this.props.modalData.activityToModify.travelModeInputValue){
        //On reprend l'ancien id de départ
        startPlaceId = this.props.modalData.activityToModify.origin.placeId;
        endPlaceId = this.props.modalData.activityToModify.destination.placeId;
      }

    }
    
    
    // Récupération de l'itinéraire
    let route = null;
    if(startPlaceId !== null && endPlaceId !== null){
      route = await this.getDirection(formValues.travelMode, startPlaceId, endPlaceId, dateTime)
                            .catch(e => {this.setState({messageErreur:'Itinéraire introuvable!'}); throw e;});
      newItem.route = route || null;
    }else if(this.props.modalData.isModify){
      console.log("Pas de recalcul de l'itinétaire");
    }else{
      console.error("Départ et / ou arrivée non renseignés");
    }

   
    
    //Callback pour ajout de l'étape
    this.props.addEtape(newItem);

    this.setState({modalConfirmationLoading : false});
    
    //réinitialisation du formulaire
    this.setState({addressSearched: '' , 
                    placeStartFound: {
                      placeId: null,
                      googleFormattedAddress: "",
                      lat: null,
                      lng: null,
                    },
                    placeEndFound: {
                      placeId: null,
                      googleFormattedAddress: "",
                      lat: null,
                      lng: null,
                    }
                  });
    this.props.closeModal();

  };

  // Appel au service google de direction pour retrouver le polyline d'itiniéraire
  getDirection(travelModeInput, startPlaceId, endPlaceId, dateTime){

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
          departureTime: dateTime !== undefined ? dateTime.toDate() : null,
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

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  

  
  render() {
    return (
        <Modal
        title={this.getModalTitle()}
        open={true}
        confirmLoading={this.state.confirmLoading}
        onCancel={this.props.closeModal}
        footer={[
            <Button key="back" onClick={this.props.closeModal}>
              Return
            </Button>,
            <Button form="directionfinder" key="submit" type="primary" htmlType="submit">
                  {this.props.modalData.isModify ? 'Modifier' : 'Ajouter'}
            </Button>
          ]}
      >
      
      <div className="step-finder-main">
        <Form
          id="directionfinder"
          name="AjoutDirection"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          requiredMark={false}
          initialValues={this.initFormValue()}
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
          
              <Form.Item label="Heure" name="heure">
                <TimePicker minuteStep={5} format="HH:mm" />
              </Form.Item>
              
               <Form.Item name="travelMode" defaultValue="drive">
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
                value={this.state.addressStartSearched}
                handlePlaceFound={this.handleStartFound}
              />
              
              <div>Arrivée :</div>
              <PlaceAutocompleteInput             
                value={this.state.addressEndSearched}
                handlePlaceFound={this.handleEndFound}
              />
              <div className="error">{this.state.messageErreur}</div>

        </Form>
      </div>
      </Modal>
    );
  }
}

export default DirectionFinder;
