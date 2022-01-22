import React from 'react';
import {Space, Select, Tooltip, Button, Input} from "antd";
import {PlusCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined} from '@ant-design/icons';

const { Option } = Select;

class TripList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isAddTrip : false,
            newTrip : '',
        }

    } 


    getTrips(trips){
    return (
      trips.map((trip) => <Option value={trip}>{trip}</Option>)
      )
    }

    addTrip(){
        console.log(this.state.newTrip);
        this.props.createNewTrip(this.state.newTrip);
        this.swichAdd();
    }


    swichAdd(){
        const isAddTrip = this.state.isAddTrip;
        this.setState({isAddTrip : !isAddTrip});
    }

    handleTripInput = e => {
        this.setState({newTrip : e});
    }

    delete(){
        this.props.deleteTrip();
    }

    renderList(){
        return (
             <Space size={12}>
                
                    <Select value={this.props.selectedTrip} 
                            style={{ width: 150, textalign: 'left' }} 
                            onChange={this.props.handleTripSelection} 
                    >
                    {this.getTrips(this.props.trips)}
                    </Select>
             
                    <Tooltip title="Ajouter un nouveau trip">
                        <Button type="primary" shape="circle" icon={<PlusCircleOutlined />} onClick={() => this.swichAdd()} />
                    </Tooltip>

                    <Tooltip title="Ajouter un nouveau trip">
                        <Button type="primary" shape="circle" icon={<DeleteOutlined/>} onClick={() => this.delete()} />
                    </Tooltip>

            </Space>);
    }

    
    renderAddTrip(){
        return (
            <Space size={12}>
                <Input placeholder='Nom du trip' onChange={(e) => this.handleTripInput(e.target.value)}/>
                <Tooltip title="Annuler">
                        <Button type="primary" shape="circle" icon={<CloseCircleOutlined />} onClick={() => this.swichAdd()} />
                    </Tooltip>
                <Tooltip title="Ajouter un nouveau trip">
                        <Button type="primary" shape="circle" icon={<CheckCircleOutlined />} onClick={() => this.addTrip()} />
                </Tooltip>
            </Space>
        );
    }


    render(){
        return(
            this.state.isAddTrip ? this.renderAddTrip() :this.renderList()
        );
    }




}

export default TripList;