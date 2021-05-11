import React from 'react';
import { DatePicker, Form, Button } from 'antd';
import 'antd/dist/antd.css';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';

class StepFinder extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            etapeIdCount : 9,
            addressSearched: '',
            value:null,
            placeFound : {
              selectedPlace : '',
              googleFormattedAddress : '',
              lat : null,
              long : null,
            }
            
		};

    this.onDatePicking = this.onDatePicking.bind(this);
    
	}

    onDatePicking(date, dateString) {
        console.log(date, dateString);
    }


    onFinish = (formValues) => {
      console.log('Success Formulaire Validé:', formValues);
      console.log('GoogleFormattedAddress', this.state.placeFound.googleFormattedAddress);

      var idEtape = this.state.etapeIdCount;
			var newItem = {
				'id' : idEtape++,
        'date' : formValues.dateetape.toString(),
        'googlePlace' : this.state.selectedPlace,
        'googleFormattedAdress' : this.state.placeFound.googleFormattedAddress,
				'lat' : this.state.placeFound.lat,
				'long' : this.state.placeFound.lng,
				'selected' : true
			};
			this.setState({etapeIdCount:idEtape});
			this.props.addEtape(newItem);
    };
  
    onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    handleChange = value => {
      this.setState({ addressSearched:value });
     };


    handleSelect = async value => {
      const results = await geocodeByAddress(value);

      console.log(results);

      const latLng = await getLatLng(results[0]);
      
      var placeFound = {
        selectedPlace : value,
        googleFormattedAddress : results[0].formatted_address,
        lat : latLng.lat,
        lng : latLng.lng,
      };
      this.setState({addressSearched:value})
      this.setState({placeFound:placeFound});
      
      };



    render() {
	    return (
      <div>
        <Form
          name="AjoutEtape"
          layout="inline"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          requiredMark={false}
        >
         
              <Form.Item label="Date " name="dateetape" rules={[{ required: true, message: 'Tu as bien une idée de la date?' }]}>
                <DatePicker onChange={this.onDatePicking} />
              </Form.Item>

            
           <Form.Item label="Lieu" name="place">
           <PlacesAutocomplete
              value={this.state.addressSearched}
              onChange={this.handleChange}
              onSelect={this.handleSelect}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: 'Search Places ...',
                      className: 'location-search-input',
                    })}
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => {
                      const className = suggestion.active
                        ? 'suggestion-item--active'
                        : 'suggestion-item';
                      // inline style for demonstration purpose
                      const style = suggestion.active
                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
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
            </Form.Item>
            <Form.Item >
              <Button type="primary" htmlType="submit">
                Ajouter
              </Button>
            </Form.Item>
         </Form>
         
            
          </div>
	    );
	}


}

export default StepFinder;