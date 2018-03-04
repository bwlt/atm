import crypto from 'crypto'
import qs from 'querystring'
import React from 'react'
import v4 from 'uuid/v4'

import conf from '../../conf'
import InfoWindow from './InfoWindow'
import Marker from './Marker'
import Polyline from './Polyline'


interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: (map: google.maps.Map) => null | React.ReactNode,
  center: google.maps.LatLng | google.maps.LatLngLiteral,
  zoom: number,
}

interface State {
  map: null | google.maps.Map
}


export default class GMap extends React.Component<Props, State> {
  static InfoWindow = InfoWindow
  static Marker = Marker
  static Polyline = Polyline

  private mapEl: null | HTMLDivElement = null

  state: State = { map: null }

  componentDidMount() {
    const hash = crypto.createHash('sha256')
    const uuid = v4()
    hash.update(uuid)
    const callbackName = hash.digest('hex')
    const mapEl = this.mapEl
    ;(window as any)[callbackName] = () => {
      const map = new google.maps.Map(mapEl, {
        zoom: this.props.zoom,
        center: this.props.center
      })
      this.setState({ map })
    }
    const googleMapsApiScriptEl = document.createElement('script')
    googleMapsApiScriptEl.async = true
    googleMapsApiScriptEl.defer = true
    googleMapsApiScriptEl.src = `https://maps.googleapis.com/maps/api/js?${qs.stringify({
      key: conf.googleMapsAPIKey,
      callback: callbackName
    })}`
    document.body.appendChild(googleMapsApiScriptEl)
  }

  render() {
    const { children, ...rest } = this.props
    return (
      <>
        <div
          ref={el => this.mapEl = el}
          {...rest}
        />
        {this.state.map && children(this.state.map)}
      </>
    )
  }
}