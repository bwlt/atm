import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import { withApollo, ApolloProvider } from 'react-apollo'

import { JourneyPatternResponse } from '../queries'
import GMap from './GMap'


interface Props {
  map: google.maps.Map,
  content: React.ReactElement<any>,
  stop: JourneyPatternResponse['journeyPattern']['Stops'][0]
}

interface InjectedProps extends Props {
  client: ApolloClient<any>
}

class StopMarker extends React.Component<InjectedProps> {
  infoWindow: null | google.maps.InfoWindow = null
  marker: null | google.maps.Marker = null
  container: HTMLDivElement

  constructor(props: InjectedProps) {
    super(props)
    this.container = document.createElement('div')
  }

  componentDidMount() {
    if (this.marker) {
      this.marker.addListener('click', this.handleMarkerClick)
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
          scale: 4,
          fillColor: 'white',
          strokeColor: 'black',
          strokeWeight: 1,
          fillOpacity: 1,
        }}
        position={{ lat: stop.Location.Y, lng: stop.Location.X }}
      />
    )
  }

  private handleMarkerClick = () => {
    if (this.infoWindow === null) {
      const element = (
        <ApolloProvider client={this.props.client}>
          {this.props.content}
        </ApolloProvider>
      )
      ReactDOM.render(element, this.container)
      this.infoWindow = new google.maps.InfoWindow({
        content: this.container
      })
    }
    if (this.marker) {
      this.infoWindow.open(this.props.map, this.marker)
    }
  }
}

export default withApollo(StopMarker as any) as React.ComponentType<Props>