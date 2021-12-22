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
      modalVisible : false,
      modalTimeOfDay : '' };
  
    this.onClickItem = this.onClickItem.bind(this);
    this.onClickDirection = this.onClickDirection.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.showModal = this.showModal.bind(this);
    this.getActivity = this.getActivity.bind(this);
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
	

  

  showModal(modalTimeOfDay){
    this.setState({modalTimeOfDay : modalTimeOfDay, modalVisible : true});
  };

  closeModal = () => {
        this.setState({ modalVisible : false });
    } 
  

  getActivity(timeOfDay, dayActivite){
    return dayActivite.find(e => e.activityType === timeOfDay) ? dayActivite.find(e => e.activityType === timeOfDay).nomEtape : 'Ajouter';
  }

	render(){
		return (
      <div //className="leaderboard__profile" 
        //onClick={this.onClickItem}
      >
        <div className="StepFinder">
          <StepFinder modalVisible={this.state.modalVisible} 
                      closeModal={this.closeModal}
                      etapeDay={this.props.data.etapeDay} 
                      timeOfDay={this.state.modalTimeOfDay} 
                      addEtape={this.props.addEtape}  />
        </div>
  
        <Row gutter={[24,16]}>
          <Col span={7} className="timeoftheday">
            Matin
          </Col>
          <Col span={3} className="timeoftheday">
            🍽️ {this.getActivity('midi', this.props.data.activities)}
            <PlusCircleOutlined onClick={() => this.showModal('midi')} />
          </Col>
          <Col span={7} className="timeoftheday">
           Aprem
          </Col>
          <Col span={3} className="timeoftheday">
            🍽️ {this.getActivity('dinner', this.props.data.activities)}
    
            <PlusCircleOutlined onClick={() => this.showModal('dinner')} />
          </Col>
          <Col span={4} className="timeoftheday">
            🛏️  {this.getActivity('hotel', this.props.data.activities)}
            <PlusCircleOutlined onClick={() => this.showModal('hotel')} />
            Hotel
          </Col>
        </Row>
      </div>
    );
	}
}

export default Etape;
