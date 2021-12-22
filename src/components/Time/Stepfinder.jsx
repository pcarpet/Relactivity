import React from "react";
import "./stepFinder.scss"
import "antd/dist/antd.css";
import moment from "moment";
import { DatePicker, TimePicker, Form, Button, Input, Radio, Modal } from "antd";
import { Row, Col } from "antd";
import Emoji from "a11y-react-emoji";
import "moment/locale/fr";
import locale from "antd/es/date-picker/locale/fr_FR";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";


class StepFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalConfirmationLoading : false,
      etapeIdCount: 6,
      addressSearched: "",
      value: null,
      placeFound: {
        selectedPlace: "",
        googleFormattedAddress: "",
        lat: null,
        long: null,
      },
    };
  }
  
  
  /* Validation du formulaire */
  onFinish = (formValues) => {
    
    this.setState({modalConfirmationLoading : true});
    // Valeur par defaut si non renseigné
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

    console.log("Ajout d'une activité pour le :", this.props.etapeDate);
    console.log("Success Formulaire Validé:", formValues);
    console.log(
      "GoogleFormattedAddress",
      this.state.placeFound.googleFormattedAddress
    );

    let idEtape = this.state.etapeIdCount;
    let newItem = {
      key: 0,
      activityType : this.props.timeOfDay,
      date: this.props.etapeDay,
      heure: formValues.heure === undefined ? null : (moment(formValues.heure.format("HH:mm"), "HH:mm") || null),
      nomEtape: formValues.nomEtape || null,
      //price: formValues.price || null,
      googlePlace: this.state.selectedPlace || null,
      googlePlaceId: this.state.placeFound.placeId || null,
      googleFormattedAdress: this.state.placeFound.googleFormattedAddress || null,
      lat: this.state.placeFound.lat || null,
      long: this.state.placeFound.lng || null,
      selected: true,
    };
    console.log(newItem);
    this.setState({ etapeIdCount: idEtape });
    this.props.addEtape(newItem);
    this.props.closeModal();
    this.setState({modalConfirmationLoading : false});
    this.setState({ addressSearched: '' });
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  handleChange = (value) => {
    this.setState({ addressSearched: value });
  };

  // Appel des l'API place pour récupérer des l'infos sur le Place selectionné
  handleSelect = async (value) => {
    var results = null;
    try {
      results = await geocodeByAddress(value);
    } catch (e) {
      console.log("Error on GooglePlace Search");
      console.log(e);
    }
    console.log(results);

    const latLng = await getLatLng(results[0]);
    
    var placeFound = {
      selectedPlace: value,
      placeId: results[0].place_id,
      googleFormattedAddress: results[0].formatted_address,
      lat: latLng.lat,
      lng: latLng.lng,
    };
    this.setState({ addressSearched: value });
    this.setState({ placeFound: placeFound });
  };
 

  render() {
    return (
        <Modal
        title="Ajouter une étape"
        visible={this.props.modalVisible}
        confirmLoading={this.state.confirmLoading}
        onCancel={this.props.closeModal}
        footer={[
            <Button key="back" onClick={this.props.closeModal}>
              Return
            </Button>,
            <Button form="stepfinder" key="submit" type="primary" htmlType="submit">
                  Ajouter
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
          initialValues={{ activityType: "travel", dateetape: this.props.lastDate}}
        >
              <Form.Item
                label="Description"
                name="nomEtape"
                rules={[
                  { required: true, message: "Donne un nom à ton étape" },
                ]}
              >
                <Input></Input>
              </Form.Item>
          
              <Form.Item label="Heure" name="heure">
                <TimePicker minuteStep={5} format="HH:mm" />
              </Form.Item>
        
              <div>Lieu :</div>
              <PlacesAutocomplete
                value={this.state.addressSearched}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <div>
                    <input
                      {...getInputProps({
                        placeholder: "Lieu de l'étape",
                        className: "location-search-input",
                      })}
                    />
                    <div className="autocomplete-dropdown-container">
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion) => {
                        const className = suggestion.active
                          ? "suggestion-item active"
                          : "suggestion-item";

                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                            })}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
           
           
              <Form.Item>
                
              </Form.Item>
           
        </Form>
      </div>
      </Modal>
    );
  }
}

export default StepFinder;
