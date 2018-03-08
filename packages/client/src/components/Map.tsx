import * as React from 'react'
import { ApolloClient } from 'apollo-boost'
import { Query } from 'react-apollo'
import styled from 'styled-components'

import * as queries from '../queries'
import { JourneyPatternResponse, JourneyPattern, JourneyPatternSlim } from '../queries'
import Checkbox from './Checkbox'
import Col from './Col'
import GMap from './GMap'
import Input from './Input'
import Layout from './Layout'
import Row from './Row'
import StopMarker from './StopMarker'
import StopMarkerContent from './StopMarkerContent'

interface Props {
  client: ApolloClient<any>
}

interface State {
  checkedLines: { [lineID: string]: boolean },
  inputValue: string,
  journeyPatterns: {
    [lineID: string]: JourneyPattern
  }
}

const JourneyPatternSearchBox = styled.div`
  width: 100%;
  margin: .5em;
  padding: .5em;
  border: 1px solid black;

  ${Input} {
    width: 100%;
  }
`

const JourneyPatternList = styled.ul`
  margin: 0;
  padding: 0;
  margin-top: 10px;
  list-style: none;
  height: 400px;
  overflow-y: scroll;
`
const JourneyPatternElement = styled.li``

const milan = { lat: 45.464, lng: 9.189 }
const zoom = 13

const min = (a: number, b: number): number => a < b ? a : b
const max = (a: number, b: number): number => a > b ? a : b
const listMin = (list: number[]) => list.reduce(min, list[0])
const listMax = (list: number[]) => list.reduce(max, list[0])


class Map extends React.Component<Props, State> {

  map: null | google.maps.Map = null

  state: State = {
    checkedLines: {},
    inputValue: '',
    journeyPatterns: {}
  }

  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value
    this.setState({ inputValue })
  }

  private centerToJourneyPattern() {
    const allLatLngBounds = Object.keys(this.state.journeyPatterns)
      .filter(jpID => this.state.checkedLines[jpID] === true)
      .map(jpID => {
        const jp = this.state.journeyPatterns[jpID]
        const { Geometry: { BoundingBox_NE: topRight, BoundingBox_SW: bottomLeft } } = jp
        return {
          east:  topRight.X,
          north: topRight.Y,
          south: bottomLeft.Y,
          west:  bottomLeft.X,
        }
      })
    if (allLatLngBounds.length > 0) {
      const latLngBounds = {
        east:  listMax(allLatLngBounds.map(b => b.east)),
        north: listMax(allLatLngBounds.map(b => b.north)),
        south: listMin(allLatLngBounds.map(b => b.south)),
        west:  listMin(allLatLngBounds.map(b => b.west)),
      }
      if (this.map) {
        this.map.fitBounds(latLngBounds)
      }
    }
    else {
      if (this.map) {
        this.map.setCenter(milan)
        this.map.setZoom(zoom)
      }
    }
  }

  private handleCheckboxChange = (jpID: string) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.currentTarget.checked
    await new Promise(resolve => this.setState({ checkedLines: { ...this.state.checkedLines, [jpID]: checked } }, resolve))

    if (checked && !this.state.journeyPatterns[jpID]) {
      const jp = await this.props.client.query<JourneyPatternResponse>({
        query: queries.JOURNEY_PATTERN,
        variables: { id: jpID }
      }).then(response => response.data.journeyPattern)
      await new Promise(resolve => this.setState({ journeyPatterns: { ...this.state.journeyPatterns, [jpID]: jp } }, resolve))
    }
    this.centerToJourneyPattern()
  }

  private journeyPatternsFilter = (jp: JourneyPatternSlim) => {
    if (this.state.checkedLines[jp.Id] === true) return true
    return jp.Line.LineDescription.toLowerCase()
      .includes(this.state.inputValue.toLowerCase())
  }

  render() {
    return (
      <Layout>
        <Row style={{height: '100%'}}>
          <Col col={8}>
            <Query query={queries.JOURNEY_PATTERNS}>
              {({ loading, error, data }) => {
                if (loading) return <div>Loading...</div>;
                if (error) return <div>Error :(</div>;
                if (!data) return null

                const jps: JourneyPatternSlim[] = (data as any).journeyPatterns
                const filtered = jps.filter(this.journeyPatternsFilter)
                return (
                  <JourneyPatternSearchBox>
                    <Input
                      autoFocus
                      onChange={this.handleInputChange}
                      placeholder="Nome o numero linea"
                      value={this.state.inputValue}
                    />
                    {filtered.length === 0 ? (
                      <p>No matches found :(</p>
                    ) : (
                      <JourneyPatternList>
                        {filtered.map((jp, idx) => (
                          <JourneyPatternElement key={`${jp.Id}.${idx}`}>
                            <Checkbox
                              onChange={this.handleCheckboxChange(jp.Id)}
                              checked={!!this.state.checkedLines[jp.Id]}>
                              {jp.Line.LineDescription}
                            </Checkbox>
                          </JourneyPatternElement>
                        ))}
                      </JourneyPatternList>
                    )}
                  </JourneyPatternSearchBox>
                )
              }}
            </Query>
          </Col>
          <Col>
            <GMap
              center={milan}
              ref={el => {
                if (!el) return
                const map = el.getMap()
                if (!map) return
                this.map = map
              }}
              style={{ width: '100%', height: '100%' }}
              zoom={zoom}>
              {(map) => {
                const checkedJourneyPatterns = Object.keys(this.state.journeyPatterns)
                  .filter(jpID => this.state.checkedLines[jpID] === true)
                  .map(jpID => this.state.journeyPatterns[jpID])
                const segments = checkedJourneyPatterns.reduce((acc, jp) =>
                  [...acc, ...jp.Geometry.Segments]
                , ([] as JourneyPattern['Geometry']['Segments']))
                const stops = checkedJourneyPatterns.reduce((acc, jp) => {
                  return [...acc, ...jp.Stops]
                }, ([] as JourneyPattern['Stops']))
                return (
                  <>
                    {stops.map((stop, idx) => (
                      <StopMarker
                        key={idx}
                        content={<StopMarkerContent stopID={stop.Code} />}
                        stop={stop}
                        map={map}
                      />
                    ))}
                    {segments.map((segment, idx) => (
                      <GMap.Polyline
                        key={idx}
                        map={map}
                        path={segment.Points.map(({ X, Y }) => ({ lat: Y, lng: X }))}
                        strokeColor={segment.RGB}
                      />
                    ))}
                  </>
                )
              }}
            </GMap>
          </Col>
        </Row>
      </Layout>
    )
  }
}


export default Map