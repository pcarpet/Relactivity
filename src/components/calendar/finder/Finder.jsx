import React from "react";
import StepFinder from "./Stepfinder";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import { Menu, Button, Modal } from 'antd';
import { PushpinOutlined, NodeIndexOutlined } from '@ant-design/icons';
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
            confirmLoading: false,
        }

        this.finderLoading = this.finderLoading.bind(this)
    }

    onMenuClick = (e) => {
        console.log('event', e);
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

    renderFinder(finderType){
        switch (finderType) {
            case 'stepfinder':
                return(
                    <StepFinder
                    //On bricole la génération d'une clef pour réinitialiser le composant sinon le init du Form ne met pas à jour.
                    key={this.props.isModify?this.props.activityToModify.key:dayjs().unix()}
                    isModify={this.props.isModify}
                    eventToCreate={this.props.event}
                    activityToModify={this.props.activityToModify}
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