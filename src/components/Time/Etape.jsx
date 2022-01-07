import React from 'react';
import "./etape.scss";
import { Row, Col} from "antd";
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, CompassOutlined } from "@ant-design/icons";

class Etape extends React.Component{

  constructor(props){
		super(props);

    this.state = { 
      etapeLocal: this.props.data,
   };
    this.onClickItem = this.onClickItem.bind(this);
    this.onClickDirection = this.onClickDirection.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickModify = this.onClickModify.bind(this);
    this.getActivity = this.getActivity.bind(this);
  }


	onClickItem(activityKey){
			console.log("Click sur l'item : " + activityKey);
			this.props.cbBg(activityKey);
			//console.log(e.nativeEvent.srcElement.innerText);		
  }
  
  onClickDirection() {
    this.props.getStepToStepDirection(this.state.key);
  }

  onClickModify(key){
    this.props.modifyActivity(key);
  }

  onClickDelete(key){
    this.props.deleteActivity(key);
  }
	

  getActivity(timeOfDay, dayActivite){
    const activity = dayActivite.find(e => e.activityType === timeOfDay);
    if (activity === undefined){
      return ( 
            <PlusCircleOutlined onClick={() => this.props.showStepModal(this.props.data.etapeDay, timeOfDay)} />
        );
    }else{
      return  (
              <Row>
                <Col className="activite resto">
                  {activity.nomEtape}
                </Col>
                <Col className="activite_icon">
                  <DeleteOutlined onClick={() => this.onClickDelete(activity.key)}/>
                </Col>
              
              
              </Row>
              );
     }
    }

  getMatinApremActivities(timeOfDay, dayActivities){
    const activies = dayActivities.filter(e => e.activityType === timeOfDay)
    return (
      <div>
              {activies.map((act) => (
                <Row>
                  <Col className="activite" onClick={() => this.onClickItem(act.key)}> 
                    {(act.heure === undefined || act.heure === null) ? '' : act.heure.format("HH:mm") + ' - '}
                    {act.nomEtape} </Col>
                  <Col className="activite_icon">
                    <EditOutlined onClick={() => this.onClickModify(act.key)}/>
                  </Col>
                  <Col className="activite_icon">
                    <DeleteOutlined onClick={() => this.onClickDelete(act.key)}/>
                  </Col>
                </Row>
              )
              )}
              <Row>
                <PlusCircleOutlined onClick={() => this.props.showStepModal(this.props.data.etapeDay, timeOfDay)} />
                <CompassOutlined onClick={() => this.props.showDirectionModal(this.props.data.etapeDay, timeOfDay)} />
              </Row>
            </div>
    )

  }

	render(){
		return (
        <Row key={this.props.data.etapeDay.format()}>
          <Col span={7} className="timeoftheday">
            {this.getMatinApremActivities('matin', this.props.data.activities)}
          </Col>
          <Col span={3} className="timeoftheday">
            <p>🍽️</p> {this.getActivity('midi', this.props.data.activities)}
          </Col>
          <Col span={7} className="timeoftheday">
           {this.getMatinApremActivities('aprem', this.props.data.activities)}
          </Col>
          <Col span={3} className="timeoftheday">
            <p>🍽️</p> {this.getActivity('dinner', this.props.data.activities)}
          </Col>
          <Col span={4} className="timeoftheday">
            <p>🛏️</p>  {this.getActivity('hotel', this.props.data.activities)}
          </Col>
        </Row>
    );
	}
}

export default Etape;
