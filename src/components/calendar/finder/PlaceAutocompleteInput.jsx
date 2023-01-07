import React from "react";
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import "./placeAutocompleteInput.css"

class PlaceAutocompleteInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value : this.props.value}  
      }

    //pour l'autocompletion
    handleChange = (value) => {
        this.setState({ value: value });
    };


     // Appel des l'API place pour récupérer des l'infos sur le Place selectionné
    handleSelect = async (sugestedAdress) => {
        console.log("Adresse a rechercher");
          var results = null;
        try
        {
            results = await geocodeByAddress(sugestedAdress);
        } catch (e)
        {
            console.log("Error on GooglePlace Search");
            console.log(e);
        }
        console.log(results);

        const latLng = await getLatLng(results[0]);

        var placeFound = {
            placeId: results[0].place_id,
            googleFormattedAddress: results[0].formatted_address,
            lat: latLng.lat,
            lng: latLng.lng,
            sugestedAdress: sugestedAdress,
        };

        this.setState({ value: sugestedAdress });
        this.props.handlePlaceFound(placeFound);
    };

   
    render () {
        return(
        <PlacesAutocomplete
            value={this.state.value}
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
                            placeholder: "Lieu de l'activité",
                            className: "location-search-input",
                        })}
                    />
                    <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) =>
                        {
                            const className = suggestion.active
                                ? "suggestion-item active"
                                : "suggestion-item";

                            return (
                                <div key={suggestion.id}
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
    )};
}

export default PlaceAutocompleteInput;
