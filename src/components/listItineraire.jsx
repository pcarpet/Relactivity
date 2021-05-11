import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Etape from './Etape';



const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
 
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
	  marginTop:10,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(180,180,180,1.0)',
  },
  item: {
    padding: 2,
    fontSize: 16,
    height: 44,
	
  },
 
});


class ListItineraire extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			background:"violet",
		};

	}
	
	render() {
	    return (
	      <View style={styles.container} >
	        <FlatList 
			    data={this.props.listV} 
			    renderItem={({item}) => <Etape data={item}  cbBg={this.props.selectEtape} />}
	            keyExtractor={(item, index) => index}
	        />
	      </View>
	    );
	}
}



export default ListItineraire;

