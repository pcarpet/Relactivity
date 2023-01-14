import React from 'react';
import {DatePicker, Row, Col, Tooltip, Button, Input, Modal, Form, Select} from 'antd';
import { PlusCircleOutlined, DeleteOutlined} from '@ant-design/icons';
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/fr_FR";
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
        const key = this.state.isAddTrip?0:this.props.selectedTrip.key;
        this.props.createNewTrip({key: key,name: formValues.tripName, dateRange: formValues.dateRange});
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
                dateRange: [dayjs(), dayjs().add(7, 'day')],
            };
        }else{
            //Initialisation avec le voyage actuel
            return {
                //https://github.com/ant-design/ant-design/issues/39876
                dateRange: [this.props.selectedTrip.dateRange[0], this.props.selectedTrip.dateRange[1]],
                tripName: this.props.selectedTrip.name,
            };
        }
    }
    
    getTripsList(trips){
        return (
          trips.map((trip) => <Option  key={trip.key} value={trip.key}>{trip.name}</Option>)
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
                        <Input />
                    </Form.Item>

                    {/* FIXEME : Actualisation auto de la date de fin : https://ant.design/components/date-picker/ : Select range dates in 7 days */}
                    <Form.Item label="Période" name="dateRange">
                        <RangePicker 
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
            

            {this.state.isOpenModal?this.displayModal():''}
            <Col span={2}>              
            </Col>
            {(this.props.selectedTrip !== null && this.props.selectedTrip !== undefined) ? 
            (
                <>
                <Col span={8}>

                    <Button className="voyageTitleBouton" onClick={() => this.openModal()}>

                        <span>{this.props.selectedTrip.name}</span>|

                        <span>{this.props.selectedTrip.dateRange[0].format("DD MMM")}</span>
                        -<span>{this.props.selectedTrip.dateRange[1].format("DD MMM")}</span>
                    </Button>
                    <Select 
                        className="tripSelector ant-select-customize-input"
                        //value={this.props.selectedTrip} 
                        //style={{ width: 150, textalign: 'left' }} 
                        onChange={this.props.handleTripSelection}
                        dropdownMatchSelectWidth={false}
                        >
                        {this.getTripsList(this.props.trips)}
                    </Select>
                </Col>
                <Col span={1}>
                    <Tooltip title="Suprimer un  trip">
                            <Button className="boutonMenu" size="large" type="primary" shape="circle" icon={<DeleteOutlined/>} onClick={() => this.delete()} />
                    </Tooltip>
                </Col>
                </>
            ):'Créer un voyage :'}
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
