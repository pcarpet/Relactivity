import { Component } from 'react'

//https://github.com/Dooffy/google-map-react-polyline-example/blob/master/examples/polyline-as-component/src/components/Map.js

export default class Polyline extends Component {

  renderPolylines () {
    const { map, maps } = this.props

    let nonGeodesicPolyline = new maps.Polyline({
      path: [{lat:45.4640976, lng:9.1919265},{lat:45.477847, lng:9.200271799999999},{lat:45.487847, lng:9.202771799999999}],
      geodesic: false,//rendering non geodesic polyline (straight line)
      strokeColor: '#000000e4',
      strokeOpacity: 0.7,
      strokeWeight: 3
    })
    nonGeodesicPolyline.setMap(map)
  }

  render () {
    this.renderPolylines()
    return null
  }
}