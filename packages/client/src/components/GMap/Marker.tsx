import React from 'react'

interface Props extends google.maps.MarkerOptions {
  map: google.maps.Map,
  onClick?: (event: google.maps.MouseEvent) => any
}

export default class GMapMarker extends React.Component<Props> {
  marker: google.maps.Marker
  onClickMapsEventListener: null | google.maps.MapsEventListener = null

  constructor(props: Props) {
    super(props)
    this.marker = new google.maps.Marker(this.props)

    if (this.props.onClick) {
      this.onClickMapsEventListener = this.marker.addListener('click', this.props.onClick)
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.position.lat !== this.props.position.lat || nextProps.position.lng !== this.props.position.lng) {
      this.marker.setPosition(nextProps.position)
    }
  }

  componentWillUnmount() {
    this.marker.setMap(null)
    if (this.onClickMapsEventListener) this.onClickMapsEventListener.remove()
  }

  render() {
    return null
  }
}