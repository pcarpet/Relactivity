import React, { useEffect } from 'react';
import {Button, DatePicker, Form } from 'antd';
import dayjs from "dayjs";

export default function Poi({ poiData, tripStartDate, tripEndDate, hoursRange, addEtape }) {

	const [form] = Form.useForm();

	// Update the form values when tripStartDate changes
	useEffect(() => {
		form.setFieldsValue({
			tripDateSection: tripStartDate.hour(hoursRange.min.substring(0, 2)),
		});
	}, [form, tripStartDate]);


	function disabledDate(current, tripStartDate, tripEndDate) {
		// Can not select days before out of trip period. Je rajoute un jour à la fin je comprend pas pourquoi ???
		return current && (current < tripStartDate || current > tripEndDate.add(1, 'day'));
	};

	function disabledDateTime() {
		return {
			disabledHours: () => range(parseInt(hoursRange.min.substring(0, 2)), parseInt(hoursRange.max.substring(0, 2))),
			disabledSeconds: () => []
		}
	};

	function range(start, end) {
		const result = [];
		for (let i = 0; i < 24; i++) {
			if (i < start || i > end)
				result.push(i);
		}
		return result;
	};


	/* Validation du formulaire */
	function onFinish(formValues, poiData, addEtape) {

		//Création du nouvel élément à sauvegarder sans la localisation
		let newItem = {
			key: 0,
			type: 'step',
			startDate: formValues.tripDateSection,
			endDate: dayjs(formValues.tripDateSection).add(30, 'minute'),
			nomEtape: poiData.name || null,
		};

		newItem.origin = {
			addressSearched: poiData.name || null,
			placeId: poiData.place_id || null,
			googleFormattedAddress: poiData.formatted_address || null,
			lat: parseFloat(poiData.geometry.location.lat()) || null,
			long: parseFloat(poiData.geometry.location.lng()) || null,
		}

		console.log(newItem);
		addEtape(newItem);
	}




	return (<div>
		<div>{poiData.name} - Note: {poiData.rating} - Type: {poiData.types[0]}</div>
		<div>
			<div style={{ display: 'flex', alignItems: 'left' }}>
			<Form
				form={form}
				id="addPOI"
				name="AjoutPoi"
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				onFinish={(values) => onFinish(values, poiData, addEtape)}
				//onFinishFailed={onFinishFailed}
				requiredMark={true}
			//initialValues={initFormValue(tripStartDate)}
			>
			
			<Form.Item label="Date" name="tripDateSection">
					<DatePicker
						format="DD/MM HH:mm"
						disabledDate={(current) => disabledDate(current, tripStartDate, tripEndDate)}
						disabledTime={() => disabledDateTime()}
						minuteStep={5}
						showTime={{
							hideDisabledOptions: true,
							//defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
						}}
					/>
				</Form.Item>
			</Form>
			<Button
				form="addPOI"
				key="submit"
				type="primary"
				htmlType="submit"
				style={{ marginLeft: '10px' }}>
				Ajouter
			</Button>
			</div>
		</div>

	</div>);

}