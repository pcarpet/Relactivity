import React from "react";
import "./finder.scss"
import "antd/dist/antd.css";
import moment from "moment";
import {TimePicker, Form, Button, Input, Modal } from "antd";
import "moment/locale/fr";
import PlaceAutocompleteInput from "./PlaceAutocompleteInput";

class DirectionFinder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalConfirmationLoading : false,
      addressStartSearched: this.props.modalData.isModify ? this.props.modalData.activityToModify.googleFormattedAdress : '',
      addressEndSearched: this.props.modalData.isModify ? this.props.modalData.activityToModify.googleFormattedAdress : '',
      placeStartFound: {
        placeId: null,
        googleFormattedAddress: "",
        lat: null,
        long: null,
      },
      placeEndFound: {
        placeId: null,
        googleFormattedAddress: "",
        lat: null,
        long: null,
      },
    };

    this.handleStartFound = this.handleStartFound.bind(this);
    this.handleEndFound = this.handleEndFound.bind(this);
  }
  
//############### Initialisation du formulaire ########################

  initFormValue(){
    return {
      nomEtape: this.props.modalData.activityToModify.nomEtape,
      heure: this.props.modalData.activityToModify.heure,
    };
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

    // Récupération de l'itinéraire
    let direction = null;
    if(this.state.placeStartFound.placeId !== null && this.state.placeEndFound.placeId !== null){
      direction = await this.getDirection(this.state.placeStartFound.placeId, this.state.placeEndFound.placeId);
    }else{
      console.error("Départ et / ou arrivée non renseignés")
    }

    //Création du nouvel élément à sauvegarder
    let newItem = {
      key: this.props.modalData.isModify ? this.props.modalData.activityToModify.key : 0,
      activityType : this.props.modalData.timeOfDay,
      date: this.props.modalData.etapeDay,
      heure: formValues.heure === undefined ? null : (formValues.heure === null ? null : moment(formValues.heure.format("HH:mm"), "HH:mm")),
      nomEtape: formValues.nomEtape || null,
      directionsResult : direction || null,
      selected: true,
    };
    //En cas de modification de l'étape sans changment d'adresse les éléments ne sont pas rechargés
    if(this.state.placeStartFound.placeId !== null){
      newItem.addressSearched = this.state.addressSearched || null;
      newItem.googlePlaceId = this.state.placeStartFound.placeId || null;
      newItem.googleFormattedAdress = this.state.placeStartFound.googleFormattedAddress || null;
      newItem.lat = this.state.placeStartFound.lat || null;
      newItem.long = this.state.placeStartFound.lng || null;
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
                      long: null,
                    },
                    placeEndFound: {
                      placeId: null,
                      googleFormattedAddress: "",
                      lat: null,
                      long: null,
                    }
                  });
    this.props.closeModal();

  };

  // Appel au service google de direction pour retrouver le polyline d'itiniéraire
  getDirection(startPlaceId, endPlaceId){

      // const depart = this.props.activities.find((etape) => etape.key === firstStepKey);
      // const arrivee = this.props.activities.find((etape) => etape.rank === depart.rank + 1);
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();

      const request = {
          origin: {placeId : this.state.placeStartFound.placeId},
          destination: {placeId: this.state.placeEndFound.placeId},
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING
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
        visible={true}
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
          initialValues={this.props.modalData.isModify ? this.initFormValue() : {}}
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

        </Form>
      </div>
      </Modal>
    );
  }
}

export default DirectionFinder;
