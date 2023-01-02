import React from "react";
import "./finder.css"
import "antd/dist/antd.css";
import moment from "moment";
import {TimePicker, Form, Button, Input, Modal, InputNumber } from "antd";
import "moment/locale/fr";
import PlaceAutocompleteInput from "./PlaceAutocompleteInput";

class StepFinder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalConfirmationLoading : false,
      eventStartDate : moment(this.props.eventToCreate.startStr, moment.ISO_8601),
      eventEndDate : moment(this.props.eventToCreate.endStr, moment.ISO_8601),
      addressSearched: this.props.isModify ? this.props.activityToModify.origin.googleFormattedAddress : '',
      placeFound: {
        placeId: null,
        googleFormattedAddress: "",
        lat: null,
        lng: null,
      },
    };

    this.handlePlaceFound = this.handlePlaceFound.bind(this);
  }
  
  //############### Initialisaiton du formulaire ########################
    initFormValueModify(){
      return {
        nomEtape: this.props.activityToModify.nomEtape,
        heureDebut:this.props.activityToModify.startDate,
        heureFin: this.props.activityToModify.endDate,
        duree: this.props.activityToModify.duree,
      };
    }

    initFormValueCreate(){
      return {
        heureDebut: this.state.eventStartDate,
        heureFin: this.state.eventEndDate,
      };
    }
  
    //TODO : Formater la date
    getModalTitle(){
      return (this.props.isModify ? 
        "Modifier l'activité pour le " + this.props.activityToModify.date.format("DD/MM/YY") 
        : "Ajouter une activité pour le " + this.state.eventStartDate.format("dddd DD MMM"));
    }
    
  //############### Gestion des Inputs ########################
  
  //Appeler en callback par le Google place autocomplete
  handlePlaceFound(place){
    this.setState({placeFound: place });
  };

 
  /* Validation du formulaire */
  onFinish = (formValues) => {
    
    this.setState({modalConfirmationLoading : true});
    
    //FIXME: Afficer l'erreur grace au Form (cf. render)
    if (this.state.placeFound.placeId === null && (this.state.addressSearched === null || this.state.addressSearched === '')) {
     console.error("La localisation est obligatoire");
     return;
    }

    console.log("Success Formulaire Validé:", formValues);
    console.log("GoogleFormattedAddress",this.state.placeFound.googleFormattedAddress);

    //mise à jours de la date
    
    //Création du nouvel élément à sauvegarder sans la localisation
    let newItem = {
      key: this.props.isModify ? this.props.activityToModify.key : 0,
      //activityType : this.props.modalData.timeOfDay,
      startDate: this.state.eventStartDate
                      .hours(formValues.heureDebut.hours())
                      .minutes(formValues.heureDebut.minutes()),
      endDate: this.state.eventEndDate
                      .hours(formValues.heureFin.hours())
                      .minutes(formValues.heureFin.minutes()),
      nomEtape: formValues.nomEtape || null,
      //heureDebut: formValues.heureDebut === undefined ? null : (formValues.heureDebut === null ? null : moment(formValues.heureDebut.format("HH:mm"), "HH:mm")),
      //endDate: formValues.heureFin === undefined ? null : (formValues.heureFin === null ? null : moment(formValues.heureFin.format("HH:mm"), "HH:mm")),
      //duree: formValues.duree === undefined ? null : (formValues.duree === null ? null : moment(formValues.duree.format("HH:mm"), "HH:mm")),
      selected: true,
    };
    //Sauvegarde de la localisation. En cas de modification de l'étape sans recherche d'adresse, les éléments de localisation ne sont pas rechargés
    if(this.state.placeFound.placeId !== null){
      newItem.origin = { 
        addressSearched: this.state.addressSearched || null,
        placeId: this.state.placeFound.placeId || null,
        googleFormattedAddress: this.state.placeFound.googleFormattedAddress || null,
        lat: this.state.placeFound.lat || null,
        long: this.state.placeFound.lng || null,
      }
    }
    console.log(newItem);
    
    //FIMME : Création d'un evenement récurrent
    
    //Pour chaque nuit suplémentaire d'une activité hotel on ajoute une étape
    //On clone le new item avant le addEtapte sinon il est mis à jour par le core avec un ID
    /* for(var i = 1; i < formValues.nbnuits; i++){
      
      var nextNight = Object.assign({},newItem);
      // 0 car obligatoirement un nouveau jour
      nextNight.key = 0;
      // ON passe au jour suivant
      nextNight.date = nextNight.date.clone().add(i, 'days');

      //Si le place id est null sur le formulaire, c'est forcement que l'on est en modif et que l'emplacement n'a pas changé, donc on reprend celui d'origin.
      if(this.state.placeFound.placeId === null)
        nextNight.origin = this.props.activityToModify.origin;
      
      //On suprime les nuits déja existante... et ouai balek
      this.props.deleteActivityByDateAndType(nextNight.date,'hotel')
      //et on créer les nouvelles nuits
      this.props.addEtape(nextNight);
    } */
      

    //Ajout de l'étape dans la BDD et liste courante
    this.props.addEtape(newItem);


    this.setState({modalConfirmationLoading : false});
    //Réinitialisation 
    this.setState({addressSearched: '' , 
                    placeFound: {
                      placeId: null,
                      googleFormattedAddress: "",
                      lat: null,
                      lng: null,
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
        open={true}
        confirmLoading={this.state.confirmLoading}
        onCancel={this.props.closeModal}
        footer={[
            <Button key="back" onClick={this.props.closeModal}>
              Return
            </Button>,
            <Button form="stepfinder" key="submit" type="primary" htmlType="submit">
                  {this.props.isModify ? 'Modifier' : 'Ajouter'}
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
          initialValues={this.props.isModify ? this.initFormValueModify() : this.initFormValueCreate()}
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
          
              <Form.Item label="Heure Début" name="heureDebut">
                <TimePicker minuteStep={5} format="HH:mm" />
              </Form.Item>
        
              <Form.Item label="Heure Fin" name="heureFin">
                <TimePicker minuteStep={5} format="HH:mm" />
              </Form.Item>

              <Form.Item label="Durée" name="duree">
                <TimePicker minuteStep={5} format="HH:mm" />
              </Form.Item>

              <div>Lieu :</div> 
                {/* FIXME : Il faudrait utiliser une interface sur le PlaceAutocompleteInput pour qu'il soit prit en compte par le Form.Item */}
                <PlaceAutocompleteInput             
                  value={this.state.addressSearched}
                  handlePlaceFound={this.handlePlaceFound}
                />
       
                <Form.Item label="Nombre de nuits" name="nbnuits"> 
                  <InputNumber min={1} max={100}/>
                </Form.Item>

        </Form>
      </div>
      </Modal>
    );
  }
}

export default StepFinder;
