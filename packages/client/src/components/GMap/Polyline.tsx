import React from 'react'

interface Props extends google.maps.PolylineOptions {
  map: google.maps.Map
}

export default class GMapPolyline extends React.Component<Props> {
  private polyline: google.maps.Polyline

  constructor(props: Props) {
    super(props)
    this.polyline = new google.maps.Polyline({
      path: this.props.path,
      geodesic: true,
      strokeColor: this.props.strokeColor,
      strokeOpacity: 1.0,
      strokeWeight: 2
    })
    this.polyline.setMap(this.props.map)
  }

  componentWillUnmount() {
    this.polyline.setMap(null)
  }

  render() {
    return null
  }
}