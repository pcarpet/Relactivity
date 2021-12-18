import React from 'react';
import "./etape.scss";
import { Row, Col, Tooltip, Button, Typography} from "antd";
import { CompassOutlined } from "@ant-design/icons";
import Emoji from "a11y-react-emoji";

const { Paragraph } = Typography;  

class Etape extends React.Component{
	constructor(props){
		super(props);

    this.state = { key: this.props.data.key, etapeLocal: this.props.data, };
    this.onClickItem = this.onClickItem.bind(this);
    this.onClickDirection = this.onClickDirection.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onActivityNameChange = this.onActivityNameChange.bind(this);
  }


	onClickItem(){
			console.log("Click sur l'item" + this.state.key);
			this.props.cbBg(this.state.key);
			//console.log(e.nativeEvent.srcElement.innerText);		
  }
  
  onClickDirection() {
    this.props.getStepToStepDirection(this.state.key);
  }

  onClickDelete(){
    this.props.deleteActivity(this.state.key);
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

  onActivityNameChange(newName){
    var etape = this.state.etapeLocal;
    etape.nomEtape = newName;
    this.setState({etapeLocal : etape});
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
          <Col span={3}>
            {this.state.etapeLocal.heure ? this.state.etapeLocal.heure.format("HH:mm") : ""}
          </Col>
          <Col span={13}>
            <Paragraph editable={{ tooltip: false, onChange: this.onActivityNameChange }}>
              {this.state.etapeLocal.nomEtape}
            </Paragraph>
          </Col>
          <Col span={2}>
            <Tooltip
              placement="topLeft"
              title={this.state.etapeLocal.googleFormattedAdress}
            >
              <CompassOutlined />
            </Tooltip>
          </Col>
          <Col span={2}>
            <Button onClick={this.onClickDirection}>🚘</Button>
          </Col>
          <Col span={2}>
            <Button onClick={this.onClickDelete}>🗑️</Button>
          </Col>
        </Row>
      </div>
    );
	}
}

export default Etape;
