import React from 'react';
import './listEtape.scss';
import { List, Divider } from "antd";
import Etape from './Etape';


class ListEtape extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			background:"violet",
		};

	}
	
	render() {
    return (
      <div className="list-etape-main">
        <Divider orientation="left">Liste des étapes</Divider>
        <List
          split={false}
          dataSource={this.props.listV}
          rowKey={(item, index) => index}
          renderItem={(item) => (
            <List.Item className="etape">
              <Etape data={item} cbBg={this.props.selectEtape} />
            </List.Item>
          )}
        />
      </div>
    );
	}
}



export default ListEtape;

