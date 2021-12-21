import React from 'react';
import './periode.scss'
import {DatePicker, Space, Tooltip, Button} from 'antd';
import { EditOutlined, CheckCircleOutlined } from '@ant-design/icons';

const{RangePicker} = DatePicker;

class Periode extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            edit: false,
            rangePickerDisable : [true,true],
        }

        this.editDateRage = this.editDateRage.bind(this);
    }
    

    generateRangePickerKey(range){
        return range[0].valueOf() + '+' + range[0].valueOf(); 
    }


    
    editDateRage(){
        this.setState({rangePickerDisable: [false,false], edit: true})  
    }
    
    validateDateRage(){
        this.setState({rangePickerDisable: [false,false], edit: false})  
    }
    
    editButton(edit){
        if(edit){
            return  <Tooltip title="Valider">
                        <Button type="primary" shape="circle" icon={<CheckCircleOutlined /> } />
                    </Tooltip>;
        }else{
            return  <Tooltip title="Changer les dates">
                        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => this.editDateRage()} />
                    </Tooltip>;
        }
    }

   render(){
       return (
        <Space size={12}>
            <RangePicker 
                key={this.generateRangePickerKey(this.props.defaultPickerValue)} 
                defaultValue={this.props.defaultPickerValue}
                format='DD/MM/YYYY'
                disabled={this.state.rangePickerDisable}/>
            
            {this.editButton(this.state.edit)}
        </Space>
       );
   }
   
   

}

export default Periode;
