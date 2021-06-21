import React from 'react';
import "./etape.scss";
import { Row, Col, Tooltip, Button} from "antd";
import { CompassOutlined } from "@ant-design/icons";
import Emoji from "a11y-react-emoji";

class Etape extends React.Component{
	constructor(props){
		super(props);

    this.state = { key: this.props.data.key, etapeLocal: this.props.data, };
    this.onClickItem = this.onClickItem.bind(this);
    this.onClickDirection = this.onClickDirection.bind(this);
  }


	onClickItem(){
			console.log("Click sur l'item" + this.state.key);
			this.props.cbBg(this.state.key);
			//console.log(e.nativeEvent.srcElement.innerText);		
  }
  
  onClickDirection() {
    this.props.getStepToStepDirection(this.state.key);
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
              symbol={this.getEmoji(this.state.etapeLocal.activityType)}
              label={this.state.etapeLocal.activityType}
            />
          </Col>
          <Col span={5}>{this.state.etapeLocal.date ? this.state.etapeLocal.date.format("ddd DD/MM") : ""}</Col>
          <Col span={3}>
            {this.state.etapeLocal.heure ? this.state.etapeLocal.heure.format("HH:mm") : ""}
          </Col>
          <Col span={8}>{this.state.etapeLocal.nomEtape}</Col>
          <Col span={4}>
            <Tooltip
              placement="topLeft"
              title={this.state.etapeLocal.googleFormattedAdress}
            >
              <CompassOutlined />
            </Tooltip>
          </Col>
          <Col span={2}>
            <Button onClick={this.onClickDirection}>Direction</Button>
          </Col>
        </Row>
      </div>
    );
	}
}

export default Etape;
