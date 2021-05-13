import React from "react";
import "./stepFinder.scss"
import "antd/dist/antd.css";
import { DatePicker, Form, Button, Input } from "antd";
import { Row, Col } from "antd";
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
      etapeIdCount: 9,
      addressSearched: "",
      value: null,
      placeFound: {
        selectedPlace: "",
        googleFormattedAddress: "",
        lat: null,
        long: null,
      },
    };

    this.onDatePicking = this.onDatePicking.bind(this);
  }

  onDatePicking(date, dateString) {
    console.log(date, dateString);
  }

  /* Validation du formulaire */
  onFinish = (formValues) => {
    console.log("Success Formulaire Validé:", formValues);
    console.log(
      "GoogleFormattedAddress",
      this.state.placeFound.googleFormattedAddress
    );

    var idEtape = this.state.etapeIdCount;
    var newItem = {
      id: idEtape++,
      date: formValues.dateetape,
      nomEtape : formValues.nomEtape,
      googlePlace: this.state.selectedPlace,
      googleFormattedAdress: this.state.placeFound.googleFormattedAddress,
      lat: this.state.placeFound.lat,
      long: this.state.placeFound.lng,
      selected: true,
    };
    this.setState({ etapeIdCount: idEtape });
    this.props.addEtape(newItem);
    this.setState({ addressSearched: '' });
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  handleChange = (value) => {
    this.setState({ addressSearched: value });
  };

  handleSelect = async (value) => {
    const results = await geocodeByAddress(value);

    console.log(results);

    const latLng = await getLatLng(results[0]);

    var placeFound = {
      selectedPlace: value,
      googleFormattedAddress: results[0].formatted_address,
      lat: latLng.lat,
      lng: latLng.lng,
    };
    this.setState({ addressSearched: value });
    this.setState({ placeFound: placeFound });
  };

  render() {
    return (
      <div className="step-finder-main">
        <Form
          name="AjoutEtape"
          layout="inline"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          requiredMark={false}
        >
          <Row>
            <Col span={6}>
              <Form.Item
                label="Date "
                name="dateetape"
                rules={[
                  {
                    required: true,
                    message: "Tu as bien une idée de la date?",
                  },
                ]}
              >
                <DatePicker locale={locale} onChange={this.onDatePicking} />
              </Form.Item>
            </Col>
            
            <Col span={6}><Form.Item
              label="Etape"
              name="nomEtape"
              rules={[{ required: true, message: 'Donne un nom à ton étape' }]}
            >
              <Input></Input>
            </Form.Item>
            </Col>
              
            <Col span={10}>
              
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
                              className
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
            </Col>

            <Col span={2}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Ajouter
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default StepFinder;
