import { Component } from 'react'

//https://github.com/Dooffy/google-map-react-polyline-example/blob/master/examples/polyline-as-component/src/components/Map.js

export default class Polyline extends Component {

  renderPolylines () {
    const { map, maps, path } = this.props

    if (maps === undefined) { return;}

    let nonGeodesicPolyline = new maps.Polyline({
      path: path,
      geodesic: false,//rendering non geodesic polyline (straight line)
      strokeColor: '#0000f0e4',
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