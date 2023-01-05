import React from "react";
import StepFinder from "./Stepfinder";
import { Menu, Button, Modal } from 'antd';
import { PushpinOutlined, NodeIndexOutlined } from '@ant-design/icons';
import moment from "moment";
import "./finder.css"



//Les keys du menu sont les id des formulaires des finders
const finderMenuItems = [
    {
      label: 'Activité',
      key: 'stepfinder',
      icon: <PushpinOutlined />,
    },
    {
      label: 'Itinéraire',
      key: 'directionfinder',
      icon: <NodeIndexOutlined />,
    }]



class Finder extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            finderType: 'stepfinder',
            confirmLoading: false
        }

        this.finderLoading = this.finderLoading.bind(this)
    }

    onMenuClick = (e) => {
        console.log('event', e);
        this.setState({finderType: e.key});
    }

    getModalTitle(){
        return (this.props.isModify ? 
          "Modifier l'activité pour le " + this.props.activityActivityToModify.startDate.format("dddd DD MMM")
          : "Ajouter une activité pour le "  + moment(this.props.event.startStr, moment.ISO_8601).format("dddd DD MMM"));
    }
    
    finderLoading(l){
        this.setState({confirmLoading : l});
    }

    renderFinder(finderType){
        switch (finderType) {
            case 'stepfinder':
                return(
                    <StepFinder  
                    isModify={this.props.isModify}
                    eventToCreate={this.props.event}
                    activityToModify={this.props.activityToModify} //notimplemented
                    closeModal={this.props.closeModal}
                    addEtape={this.props.addEtape}
                    finderLoading={this.finderLoading}
                    />
                )
            case 'directionfinder':
                return('toto'
                       /*  <DirectionFinder 
                                    closeModal={this.closeDirectionModal}
                                    modalData={this.state.modalData} 
                                    addEtape={this.props.addEtape}  /> */
                    
                )
                
        }
    }

    render() {
        return (
            <Modal
            title={this.props.openModal ? this.getModalTitle():''}
            open={this.props.openModal} 
            onCancel={this.props.closeModal}
            confirmLoading={this.state.confirmLoading} //FIXME ca semble faire kedall
            footer={[
                <Button key="back" onClick={this.props.closeModal}>
                    Return
                </Button>,
                <Button 
                    form={this.state.finderType} 
                    key="submit" 
                    type="primary" 
                    htmlType="submit">
                        {this.props.isModify ? 'Modifier' : 'Ajouter'}
                </Button>
                ]}>
                <Menu 
                    onClick={this.onMenuClick}
                    selectedKeys={[this.state.finderType]}
                    mode="horizontal" 
                    items={finderMenuItems} 
                    />
                <div className="StepFinder">
                    {this.renderFinder(this.state.finderType)}
                </div>
            </Modal>
        );
    }


}

export default Finder;