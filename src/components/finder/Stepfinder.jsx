import React from "react";
import "./finder.scss"
import "antd/dist/antd.css";
import moment from "moment";
import {TimePicker, Form, Button, Input, Modal } from "antd";
import "moment/locale/fr";
import PlaceAutocompleteInput from "./PlaceAutocompleteInput";

class StepFinder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalConfirmationLoading : false,
      addressSearched: this.props.modalData.isModify ? this.props.modalData.activityToModify.googleFormattedAdress : '',
      placeFound: {
        placeId: null,
        googleFormattedAddress: "",
        lat: null,
        long: null,
      },
    };

    this.handlePlaceFound = this.handlePlaceFound.bind(this);
  }
  
  //############### Initialisaiton du formulaire ########################
    initFormValue(){
      return {
        nomEtape: this.props.modalData.activityToModify.nomEtape,
        heure: this.props.modalData.activityToModify.heure,
        };
    }
  
    getModalTitle(){
      return "Ajouter une étape " + this.props.modalData.timeOfDay + " pour le " + this.props.modalData.etapeDay.format("DD/MM/YY") ;
    }
    
  //############### Gestion des Inputs ########################
  
  //Appeler en callback par le Google place autocomplete
  handlePlaceFound(place){
    this.setState({ placeFound: place });
  };

 
  /* Validation du formulaire */
  onFinish = (formValues) => {
    
    this.setState({modalConfirmationLoading : true});
    
    //FIXME-MOCKUP-WARNIIIING --- Valeur par defaut si non renseigné
    if (this.state.placeFound === null) {
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

    console.log("Ajout d'une activité pour le :", this.props.modalData.etapeDay.format("DD/MM/YYYY"));
    console.log("Success Formulaire Validé:", formValues);
    console.log("GoogleFormattedAddress",this.state.placeFound.googleFormattedAddress);

    //Création du nouvel élément à sauvegarder
    let newItem = {
      key: this.props.modalData.isModify ? this.props.modalData.activityToModify.key : 0,
      activityType : this.props.modalData.timeOfDay,
      date: this.props.modalData.etapeDay,
      heure: formValues.heure === undefined ? null : (formValues.heure === null ? null : moment(formValues.heure.format("HH:mm"), "HH:mm")),
      nomEtape: formValues.nomEtape || null,

      selected: true,
    };
    //En cas de modification de l'étape sans changment d'adresse les éléments ne sont pas rechargés
    if(this.state.placeFound.placeId !== null){
      newItem.addressSearched = this.state.addressSearched || null;
      newItem.googlePlaceId = this.state.placeFound.placeId || null;
      newItem.googleFormattedAdress = this.state.placeFound.googleFormattedAddress || null;
      newItem.lat = this.state.placeFound.lat || null;
      newItem.long = this.state.placeFound.lng || null;
    }
    console.log(newItem);

    this.props.addEtape(newItem);
    this.setState({modalConfirmationLoading : false});
    //Réinitialisation 
    this.setState({addressSearched: '' , 
                    placeFound: {
                      googleFormattedAddress: "",
                      lat: null,
                      long: null,
                    }});
    this.props.closeModal();

  };

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
            <Button form="stepfinder" key="submit" type="primary" htmlType="submit">
                  {this.props.modalData.isModify ? 'Modifier' : 'Ajouter'}
            </Button>
          ]}
      >
      
      <div className="step-finder-main">
        <Form
          id="stepfinder"
          name="AjoutEtape"
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
        
              <div>Lieu :</div>
              <PlaceAutocompleteInput             
                value={this.state.addressSearched}
                handlePlaceFound={this.handlePlaceFound}
            />
           
        </Form>
      </div>
      </Modal>
    );
  }
}

export default StepFinder;
