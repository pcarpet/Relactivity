import React from "react";
import StepFinder from "./Stepfinder";
import DirectionFinder from "./DirectionFinder";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import { Menu, Button, Modal } from 'antd';
import { PushpinOutlined, NodeIndexOutlined } from '@ant-design/icons';
import "./finder.css"


class EventModal extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            finderType: this.props.isModify ? this.props.activityToModify.type + 'finder' : 'stepfinder',
            confirmLoading: false,
        }

        this.finderLoading = this.finderLoading.bind(this)
    }

/*     getFinderType(type){
        return  this.props.isModify ? this.props.activityToModify.type + 'finder' : 'stepfinder',
    } */

    onMenuClick = (e) => {
        console.log('event', e);
        console.log('finderType', this.state.finderType);
        if(this.state.finderType === e.key) return ;

        this.setState({finderType: e.key});
    }

    getModalTitle(){
        console.log(this.props.activityToModify)
        return (this.props.isModify ? 
          "Modifier l'activité pour le " + this.props.activityToModify.startDate.locale('fr').format("dddd DD MMM","fr")
          : "Ajouter une activité pour le "  + dayjs(this.props.event.startStr).locale('fr').format("dddd DD MMM", "fr"));
    }
    
    finderLoading = (l) => {
        this.setState({confirmLoading : l});
    }

//Les keys du menu sont les id des formulaires des finders
    getFinderMenuItem(isModify, type){
        return [
            {
            label: 'Activité',
            key: 'stepfinder',
            icon: <PushpinOutlined />,
            disabled: isModify && type !== 'stepfinder'
            },
            {
            label: 'Itinéraire',
            key: 'directionfinder',
            icon: <NodeIndexOutlined />,
            disabled: isModify && type !== 'directionfinder'
            }]
    }

    renderFinder(finderType){
        switch (finderType) {
            case 'stepfinder':
                return(
                    <StepFinder
                    isModify={this.props.isModify}
                    eventToCreate={this.props.event}
                    activityToModify={this.props.activityToModify}
                    closeModal={this.props.closeModal}
                    addEtape={this.props.addEtape}
                    finderLoading={this.finderLoading}
                    />
                )
            case 'directionfinder':
                return(
                    <DirectionFinder 
                        isModify={this.props.isModify}
                        eventToCreate={this.props.event}
                        activityToModify={this.props.activityToModify}
                        closeModal={this.props.closeModal}
                        addEtape={this.props.addEtape}  
                        finderLoading={this.finderLoading}
                    />
                    
                )
            default :
                    console.error('Type de finder / formulaire non reconnu');
                
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
                    items={this.getFinderMenuItem(this.props.isModify, this.state.finderType)} 
                />
                    <div className="StepFinder">
                        {this.renderFinder(this.state.finderType)}
                    </div>
            </Modal>
        );
    }


}

export default EventModal;