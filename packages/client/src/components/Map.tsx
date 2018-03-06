import * as React from 'react'
import { ApolloClient } from 'apollo-boost'
import { Query } from 'react-apollo'
import styled from 'styled-components'

import * as queries from '../queries'
import { JourneyPatternResponse } from '../queries'
import Checkbox from './Checkbox'
import Col from './Col'
import GMap from './GMap'
import Input from './Input'
import Layout from './Layout'
import Row from './Row'
import StopMarker from './StopMarker'
import StopMarkerContent from './StopMarkerContent'

interface JourneyPattern {
  Id: string,
  Line: {
    LineDescription: string
  }
}

interface Props {
  client: ApolloClient<any>
}

interface State {
  checkedLines: { [lineID: string]: boolean },
  inputValue: string,
  journeyPatterns: {
    [lineID: string]: JourneyPatternResponse['journeyPattern']
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

const milan =
  { lat: 45.464, lng: 9.189 }


class Map extends React.Component<Props, State> {

  state: State = {
    checkedLines: {},
    inputValue: '',
    journeyPatterns: {}
  }

  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value
    this.setState({ inputValue })
  }

  private handleCheckboxChange = (jpID: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.currentTarget.checked
    this.setState({ checkedLines: { ...this.state.checkedLines, [jpID]: checked } }, async () => {
      if (checked && !this.state.journeyPatterns[jpID]) {
        const jp = await this.props.client.query<JourneyPatternResponse>({
          query: queries.JOURNEY_PATTERN,
          variables: { id: jpID }
        }).then(response => response.data.journeyPattern)
        this.setState({ journeyPatterns: { ...this.state.journeyPatterns, [jpID]: jp } })
      }
    })
  }

  private journeyPatternsFilter = (jp: JourneyPattern) => {
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

                const jps: JourneyPattern[] = (data as any).journeyPatterns
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
              style={{ width: '100%', height: '100%' }}
              zoom={13}>
              {(map) => {
                const checkedJourneyPatterns = Object.keys(this.state.journeyPatterns)
                  .filter(jpID => this.state.checkedLines[jpID] === true)
                  .map(jpID => this.state.journeyPatterns[jpID])
                const segments = checkedJourneyPatterns.reduce((acc, jp) =>
                  [...acc, ...jp.Geometry.Segments]
                , ([] as JourneyPatternResponse['journeyPattern']['Geometry']['Segments']))
                const stops = checkedJourneyPatterns.reduce((acc, jp) => {
                  return [...acc, ...jp.Stops]
                }, ([] as JourneyPatternResponse['journeyPattern']['Stops']))
                return (
                  <>
                    {stops.map((stop, idx) => {
                      return (
                        <StopMarker
                          key={idx}
                          content={<StopMarkerContent stopID={stop.Code} />}
                          stop={stop}
                          map={map}
                        />
                      )
                    })}
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