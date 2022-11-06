import React from 'react';
import {DatePicker, Row, Col, Tooltip, Button, Input, Modal, Form, Select} from 'antd';
import { PlusCircleOutlined, DeleteOutlined} from '@ant-design/icons';
import locale from "antd/es/date-picker/locale/fr_FR";
import moment from "moment";
import './menu.css';

const {RangePicker} = DatePicker;
const {Option} = Select;

class Menu extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            isOpenModal:false,
            isAddTrip : false,
        }
    }
    
    generateRangePickerKey(range){
        return range[0].valueOf() + '+' + range[1].valueOf(); 
    }


    //############ Routage des actions au composant Parent
    delete(){
        this.props.deleteTrip();
    }

    handleForm = (formValues) => {
        if(this.state.isAddTrip){
            this.props.createNewTrip({tripName: formValues.tripName, dateRange: formValues.dateRange});
        }else{
            //Update du nom du trip non implémenter
            this.props.updateListOfDays(formValues.dateRange);
        }
        this.closeModal();
    }

    //######## Gestion de l'affichage du menu
    
    openModal(){
        console.log("ouveture de la modal");
        this.setState({isAddTrip : false, isOpenModal: true});
    }
    
    openModalforNewTrip(){
        this.setState({isAddTrip : true, isOpenModal: true});
    }

    closeModal(){
        this.setState({isOpenModal: false});
    }

   
    initFormValue(){
        if(this.state.isAddTrip){
            //Initialisation pour un nouveau voyage
            return {
                tripName: "",
                dateRange: [moment(), moment().add(7, 'days')],
            };
        }else{
            //Initialisation avec le voyage actuel
            return {
                tripName: this.props.selectedTrip,
                dateRange: this.props.defaultPickerValue,
            };
        }
    }
    
    getTrips(trips){
        return (
          trips.map((trip) => <Option  key={trip} value={trip}>{trip}</Option>)
        )
    }

    //################ SOUS FONCTION D'aFFICHAGE ##############
    displayModal(){
        return(
            <Modal 
                onCancel={() => this.closeModal()}
                open={true}
                footer={[
                <Button key="back" onClick={() => this.closeModal()}>
                    Annuler
                </Button>,
                <Button form="tripForm" key="submit" type="primary" htmlType="submit">
                        Valider
                </Button>
                ]}
            >
            
                <Form 
                id="tripForm"
                onFinish={this.handleForm}
                initialValues={this.initFormValue()}
                >

                    <Form.Item label="Nom du voyage" name="tripName"
                        rules={[{ required: true, message: "Nom obligatoire" },]}
                        >
                        <Input disabled={!this.state.isAddTrip}  />
                    </Form.Item>

                    <Form.Item label="Période" name="dateRange">
                        <RangePicker 
                                key={this.generateRangePickerKey(this.props.defaultPickerValue)} 
                                format='DD/MM/YYYY'
                                locale={locale}
                                allowClear={false}
                                />
                    </Form.Item>

                </Form>
    
            </Modal>
        );
    }

   
   render(){
       return (
           
        <Row className="underHeader">
            
            <Col span={2}>              </Col>
        
            <Col span={8}>
                {this.state.isOpenModal?this.displayModal():''}

                <Button className="voyageTitleBouton" onClick={() => this.openModal()}>
                <span>{this.props.selectedTrip}</span>
                |
                <span>{this.props.defaultPickerValue[0].format("DD MMM")}</span>
                -
                <span>{this.props.defaultPickerValue[1].format("DD MMM")}</span>
                </Button>
                <Select 
                    className="tripSelector ant-select-customize-input"
                    //value={this.props.selectedTrip} 
                    //style={{ width: 150, textalign: 'left' }} 
                    onChange={this.props.handleTripSelection}
                    dropdownMatchSelectWidth={false}
                    >
                    {this.getTrips(this.props.trips)}
                </Select>
            </Col>
                
            <Col span={1}>
                <Tooltip title="Suprimer un  trip">
                        <Button className="boutonMenu" size="large" type="primary" shape="circle" icon={<DeleteOutlined/>} onClick={() => this.delete()} />
                </Tooltip>
            </Col>
            <Col span={1}>
                <Tooltip title="Ajouter un nouveau trip">
                    <Button className="boutonMenu" size="large" type="primary" shape="circle" icon={<PlusCircleOutlined />} onClick={() => this.openModalforNewTrip()} />
                </Tooltip>
            </Col>
            <Col span={12}/>
        </Row>
            
       );
   }
   
   

}

export default Menu;
