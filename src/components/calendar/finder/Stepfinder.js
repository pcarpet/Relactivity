import React, {useState} from 'react';
import "./finder.css"
import {TimePicker, Form, Input, InputNumber } from "antd";
import dayjs from "dayjs";
import PlaceAutocompleteInput from "./PlaceAutocompleteInput";



function StepFinder (props) {
  
  const [placeFound, setPlaceFound] = useState();
  const [addressSearched, setAddressSearched] = useState(props.isModify ? props.activityToModify.origin.googleFormattedAddress : '');
  
  //const [form] = Form.useForm();
  
  //############### Initialisaiton du formulaire ########################
  const initFormValue = (props) => {
    //Init global pour Créatoin et modification
      console.log('init value', props)
      let initForm = {
        heureDebut: props.isModify ? props.activityToModify.startDate : dayjs(props.eventToCreate.startStr),
        heureFin: props.isModify ? props.activityToModify.endDate : dayjs(props.eventToCreate.endStr),
      }
      // reprise des élément de l'event pour modificaiton
      if(props.isModify){
        initForm.nomEtape = props.activityToModify.nomEtape;
      }
      return initForm;
    }

  //############### Gestion des Inputs ########################
  
  //Appeler en callback par le Google place autocomplete sur sélection du résultat
  const handlePlaceFound = (place) => {
    setPlaceFound(place);
  };

   //Appeler en callback par le Place autcomplete pour prendre la valeur saisie
   const handlePlaceInputValue = (value) => {
    setAddressSearched(value);
  };
 
  /* Validation du formulaire */
  const onFinish = (formValues, props) => {
    
    console.log("Success Formulaire Validé:", formValues);
    console.log("Form props:", props);

    props.finderLoading(true);
    
    console.log('addressSearched', addressSearched);

    //FIXME: Afficer l'erreur grace au Form (cf. render))
    if ((props.isModify && addressSearched === '') || (!props.isModify && placeFound.placeId === null) ) {
      console.error("La localisation est obligatoire");
     return;
    }


    //Création du nouvel élément à sauvegarder sans la localisation
    let newItem = {
      key: props.isModify ? props.activityToModify.key : 0,
      type: 'step',
      startDate: (props.isModify ? props.activityToModify.startDate : dayjs(props.eventToCreate.startStr))
                      .hour(formValues.heureDebut.hour())
                      .minute(formValues.heureDebut.minute()),
      endDate: props.isModify ? props.activityToModify.endDate : dayjs(props.eventToCreate.endStr)
                      .hour(formValues.heureFin.hour())
                      .minute(formValues.heureFin.minute()),
      nomEtape: formValues.nomEtape || null,
    };
    //Sauvegarde de la localisation. En cas de modification de l'étape sans recherche d'adresse, les éléments de localisation ne sont pas rechargés
    if(placeFound !== undefined && placeFound.placeId !== null){
      newItem.origin = { 
        addressSearched: addressSearched || null,
        placeId: placeFound.placeId || null,
        googleFormattedAddress: placeFound.googleFormattedAddress || null,
        lat: placeFound.lat || null,
        long: placeFound.lng || null,
      }
    }
    console.log(newItem);
    

    //Ajout de l'étape dans la BDD ou modification et màj liste d'activité
    props.addEtape(newItem);

    //Init
    setPlaceFound(null);
    setAddressSearched('');

    props.finderLoading(false);    
    props.closeModal();

  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  return (
    <div className="step-finder-main">
     
      <Form
        id="stepfinder"
        //form={form}
        name="AjoutEtape"
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
        
            <Form.Item label="Heure Début" name="heureDebut">
              <TimePicker minuteStep={5} format="HH:mm" />
            </Form.Item>
      
            {/*TODO: Mettre automatiquement à jour l'heure de fin suite à une modification de l'heure de début */}
            <Form.Item label="Heure Fin" name="heureFin">
              <TimePicker minuteStep={5} format="HH:mm" />
            </Form.Item>

            <Form.Item label="Durée" name="duree">
              <TimePicker minuteStep={5} format="HH:mm" />
            </Form.Item>

            <div>Lieu :</div> 
              {/* FIXME : Il faudrait utiliser une interface sur le PlaceAutocompleteInput pour qu'il soit prit en compte par le Form.Item */}
              <PlaceAutocompleteInput             
                value={addressSearched}
                handlePlaceFound={handlePlaceFound}
                handlePlaceInputValue={handlePlaceInputValue}
              />
      
              <Form.Item label="Nombre de nuits" name="nbnuits"> 
                <InputNumber min={1} max={100}/>
              </Form.Item>

      </Form>
    </div>

  );
  
}

export default StepFinder;
