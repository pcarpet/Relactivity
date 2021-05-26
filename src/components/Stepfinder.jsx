import React from "react";
import "./stepFinder.scss"
import "antd/dist/antd.css";
import { DatePicker, Form, Button, Input,InputNumber, Radio } from "antd";
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
      key: idEtape++,
      activityType : formValues.activityType,
      date: formValues.dateetape,
      nomEtape: formValues.nomEtape,
      price: formValues.price,
      googlePlace: this.state.selectedPlace,
      googlePlaceId: this.state.placeFound.placeId,
      googleFormattedAdress: this.state.placeFound.googleFormattedAddress,
      lat: this.state.placeFound.lat,
      long: this.state.placeFound.lng,
      selected: true,
    };
    console.log(newItem);
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

  // Appel des l'API place pour récupérer des l'infos sur le Place selectionné
  handleSelect = async (value) => {
    const results = await geocodeByAddress(value);

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
      <div className="step-finder-main">
        <Form
          name="AjoutEtape"
          layout="vertical"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          requiredMark={false}
          initialValues={{ activityType: "travel" }}
        >
          <Row>
            <Col span={4}>
              <Form.Item label="Activité" name="activityType" >
                <Radio.Group >
                  <Radio.Button value="travel">
                    <Emoji symbol="✈️" label="travel" />
                  </Radio.Button>
                  <Radio.Button value="hotel">
                    <Emoji symbol="🛏️" label="hotel" />
                  </Radio.Button>
                  <Radio.Button value="activity">
                    <Emoji symbol="🎾" label="activity" />
                  </Radio.Button>
                  <Radio.Button value="resto">
                    <Emoji symbol="🍽️" label="restaurant" />
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={4}>
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

            <Col span={6}>
              <Form.Item
                label="Description"
                name="nomEtape"
                rules={[
                  { required: true, message: "Donne un nom à ton étape" },
                ]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span="2">
              <Form.Item label="Prix" name="price">
                <InputNumber min="0" step="0.01" stringMode />
              </Form.Item>
            </Col>
            <Col span={8}>
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
