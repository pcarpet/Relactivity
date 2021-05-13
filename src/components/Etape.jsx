import React from 'react';
import "./etape.scss";
import { Row, Col, Tooltip} from "antd";
import { CompassOutlined } from "@ant-design/icons";
import Emoji from "a11y-react-emoji";

class Etape extends React.Component{
	constructor(props){
		super(props);
		this.onClickItem=this.onClickItem.bind(this);
		this.state={"id":props.data.id};

	}


	onClickItem(){
			console.log("Click sur l'item" + this.state.id);
			this.props.cbBg(this.state.id);
			//console.log(e.nativeEvent.srcElement.innerText);		
	}
	
  getEmoji(value) {
    switch (value) {
      case 'travel':
        return "✈️";
      case 'hotel':
        return "🛏️";
      case 'activity':
        return "🎾";
      case 'resto':
        return "🍽️";
      default:
        console.error(`Sorry, we are out of ${value}.`);
    }
  }

	render(){
		return (
      <div className="leaderboard__profile" onClick={this.onClickItem}>
        <Row>
          <Col span={2}>
            <Emoji
              symbol={this.getEmoji(this.props.data.activityType)}
              label="this.props.data.activityType"
            />
          </Col>
          <Col span={6}>{this.props.data.date.format("ddd DD/MM")}</Col>
          <Col span={10}>{this.props.data.nomEtape}</Col>
          <Col span={4}>
            <Tooltip
              placement="topLeft"
              title={this.props.data.googleFormattedAdress}
            >
              <CompassOutlined />
            </Tooltip>
          </Col>
        </Row>
      </div>
    );
	}
}

export default Etape;
