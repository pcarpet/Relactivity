var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import LocationMap from '@salesforce/design-system-react/components/location-map';
import Button from '@salesforce/design-system-react/components/button';
import Modal from '@salesforce/design-system-react/components/modal';

import log from '@salesforce/design-system-react/utilities/log';

var locations = [{
	id: '1',
	name: 'Worldwide Corporate Headquarters',
	address: 'The Landmark @ One Market, San Francisco, CA'
}, {
	id: '2',
	name: 'salesforce.com inc Atlanta',
	address: '950 East Paces Ferry Road NE, Atlanta, GA'
}, {
	id: '3',
	name: 'salesforce.com inc Bellevue',
	address: '929 108th Ave NE, Bellevue, WA'
}, {
	id: '4',
	name: 'salesforce.com inc Boston',
	address: '500 Boylston Street 19th Floor, Boston, MA'
}, {
	id: '5',
	name: 'salesforce.com inc Chicago',
	address: '111 West Illinois Street, Chicago, IL'
}, {
	id: '6',
	name: 'salesforce.com inc Herndon',
	address: '2550 Wasser Terrace, Herndon, VA'
}, {
	id: '7',
	name: 'salesforce.com inc Hillsboro',
	address: '2035 NE Cornelius Pass Road, Hillsboro, OR'
}, {
	id: '8',
	name: 'salesforce.com inc Indy',
	address: '111 Monument Circle, Indianapolis, IN'
}, {
	id: '9',
	name: 'salesforce.com inc Irvine',
	address: '300 Spectrum Center Drive, Irvine, CA'
}];

var carte = function (_React$Component) {
	_inherits(carte, _React$Component);

	function carte(props) {
		_classCallCheck(this, carte);

		var _this = _possibleConstructorReturn(this, (carte.__proto__ || Object.getPrototypeOf(carte)).call(this, props));

		_this.state = {
			selection: _this.props.selection || undefined
		};
		return _this;
	}

	_createClass(carte, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			var locationMap = React.createElement(LocationMap, {
				defaultLocation: locations[0],
				id: 'location-map-multiple-locations-example',
				googleAPIKey: 'AIzaSyDliLquGXGts9S8YtkWVolSQEJdBL1ZuWc',
				labels: { title: 'Salesforce Locations In United States' },
				locations: locations,
				onClickLocation: function onClickLocation(event, data) {
					log({
						action: _this2.props.action,
						event: event,
						eventName: 'Location is selected',
						data: data
					});
					_this2.setState({ selection: data });
				},
				selection: this.state.selection
			});

			return React.createElement(
				IconSettings,
				{ iconPath: '/assets/icons' },
				this.props.isModal ? React.createElement(
					Modal,
					{
						isOpen: true,
						size: 'medium',
						heading: 'Salesforce Locations In United States (9)',
						footer: React.createElement(Button, {
							title: 'Go to Google Maps',
							label: 'Go to Google Maps',
							variant: 'brand'
						})
					},
					locationMap
				) : React.createElement(
					React.Fragment,
					null,
					locationMap
				)
			);
		}
	}]);

	return carte;
}(React.Component);

//ReactDOM.render(<Example />, mountNode);


carte.displayName = 'LocationMapExampleMultipleLocations';