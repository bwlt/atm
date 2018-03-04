import React from 'react'

interface Props extends google.maps.MarkerOptions {
  map: google.maps.Map
}

export default class GMapMarker extends React.Component<Props> {
  marker: google.maps.Marker

  constructor(props: Props) {
    super(props)
    this.marker = new google.maps.Marker(this.props)
  }

  componentWillUnmount() {
    this.marker.setMap(null)
  }

  render() {
    return null
  }
}