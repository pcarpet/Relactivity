import React from 'react';
import './periode.scss'
import {DatePicker, Space, Tooltip, Button} from 'antd';
import { EditOutlined, CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import locale from "antd/es/date-picker/locale/fr_FR";

const{RangePicker} = DatePicker;

class Periode extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            edit: false,
            rangePickerDisable : [true,true],
            rangePickerValue : this.props.defaultPickerValue,
        }

        this.editDateRage = this.editDateRage.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }
    
    generateRangePickerKey(range){
        return range[0].valueOf() + '+' + range[0].valueOf(); 
    }


    
    editDateRage(){
        this.setState({rangePickerDisable: [false,false], edit: true})  
    }
    
    validateDateRage(){
        this.setState({rangePickerDisable: [true,true], edit: false})
        this.props.updateListOfDays(this.state.rangePickerValue)
    }

    cancelDateRage(){
        this.setState({rangePickerDisable: [true,true], edit: false})
        //FIXME : le date picker ne se met pas à jour meme en appelant la méthode. Probléme car la valeur reste la méme ?
        this.props.updateDefaultPickerValue();
    }
    
    editButton(edit){
        if(edit){
            return  <div><Tooltip title="Annuler">
                        <Button type="primary" shape="circle" icon={<CloseCircleOutlined />} onClick={() => this.cancelDateRage()} />
                    </Tooltip>
                    <Tooltip title="Valider">    
                        <Button type="primary" shape="circle" icon={<CheckCircleOutlined />} onClick={() => this.validateDateRage()} />
                    </Tooltip></div>;
        }else{
            return  <Tooltip title="Changer les dates">
                        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => this.editDateRage()} />
                    </Tooltip>;
        }
    }

    handleChange = (value, dateString ) => {
        this.setState({rangePickerValue: value});
    }

   render(){
       return (
        <Space size={12}>
            <RangePicker 
                key={this.generateRangePickerKey(this.props.defaultPickerValue)} 
                defaultValue={this.props.defaultPickerValue}
                format='DD/MM/YYYY'
                locale={locale}
                allowClear={false}
                disabled={this.state.rangePickerDisable}
                onChange={this.handleChange}
            />
            
            {this.editButton(this.state.edit)}
        </Space>
       );
   }
   
   

}

export default Periode;
