import React from 'react'

interface Props extends google.maps.InfoWindowOptions {
  map: google.maps.Map
}

export default class GMapInfoWindow extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    new google.maps.InfoWindow(this.props)
  }

  render() {
    return null
  }
}