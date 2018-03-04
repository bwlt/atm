import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { JourneyPatternResponse } from '../queries'
import GMap from './GMap'


interface Props {
  map: google.maps.Map,
  content: React.ReactElement<any>,
  stop: JourneyPatternResponse['journeyPattern']['Stops'][0]
}

class StopMarker extends React.Component<Props> {
  infoWindow: null | google.maps.InfoWindow = null
  marker: null | google.maps.Marker = null
  container: HTMLDivElement

  constructor(props: Props) {
    super(props)
    this.container = document.createElement('div')
  }

  componentWillMount() {
    const element = this.props.content
    ReactDOM.render(element, this.container)
    this.infoWindow = new google.maps.InfoWindow({
      content: this.container
    })
  }

  componentDidMount() {
    const { marker, infoWindow } = this
    if (marker && infoWindow) {
      marker.addListener('click', () => infoWindow.open(this.props.map, marker))
    }
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.container)
    this.container.remove()
  }

  render() {
    const { stop, map } = this.props
    return (
      <GMap.Marker
        map={map}
        ref={el => el && (this.marker = el.marker)}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 3,
          fillColor: 'red',
          strokeColor: 'red',
          strokeWeight: 5
        }}
        position={{ lat: stop.Location.Y, lng: stop.Location.X }}
      />
    )
  }
}

export default StopMarker