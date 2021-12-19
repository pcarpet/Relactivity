import React from 'react';
import "./etape.scss";
import StepFinder from './Stepfinder';
import { Row, Col,Icon, Button, Typography, Modal} from "antd";
import { CompassOutlined, PlusCircleOutlined } from "@ant-design/icons";
import Emoji from "a11y-react-emoji";

const { Paragraph } = Typography;  

class Etape extends React.Component{
	constructor(props){
		super(props);

    this.state = { 
      etapeLocal: this.props.data,
      modalConfirmationLoading : true,
      modalVisible : false,
      modalTimeOfDay : '' };
  
    this.onClickItem = this.onClickItem.bind(this);
    this.onClickDirection = this.onClickDirection.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.showModal = this.showModal.bind(this);
    this.getMidi = this.getMidi.bind(this);
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
	

  

  showModal(){
    this.setState({modalTimeOfDay : 'dinner', modalVisible : true});
  };
  

  getMidi(dayActivite){
    console.log(dayActivite)
    console.log(dayActivite.find(e => e.activityType === 'travel'))
    return dayActivite.find(e => e.activityType === 'travel') ? dayActivite.find(e => e.activityType === 'travel').nomEtape : 'Midi';
  }

	render(){
		return (
      <div //className="leaderboard__profile" 
        //onClick={this.onClickItem}
      >
        <div className="StepFinder">
          <StepFinder modalVisible={this.state.modalVisible} etapeDay={this.props.data.etapeDay} timeOfDay={this.state.modalTimeOfDay} addEtape={this.props.addEtape}  />
        </div>
  
        <Row gutter={[24,16]}>
          <Col span={7} className="timeoftheday">
            Matin
          </Col>
          <Col span={3} className="timeoftheday">
            {this.getMidi(this.props.data.activities)}
          </Col>
          <Col span={7} className="timeoftheday">
           Aprem
          </Col>
          <Col span={3} className="timeoftheday">
            Dinner
            <PlusCircleOutlined onClick={this.showModal}/>
          </Col>
          <Col span={4} className="timeoftheday">
            Hotel
          </Col>
        </Row>
      </div>
    );
	}
}

export default Etape;
