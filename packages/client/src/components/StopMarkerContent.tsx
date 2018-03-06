import * as React from 'react'
import { Query } from 'react-apollo'
import styled from 'styled-components'

import * as queries from '../queries'
import { StopResponse } from '../queries'

interface Props {
  stopID: string
}

const LineInfo = styled.h3`
  small {
    color: gray;
  }
`

const RefreshSpan = styled.span`
  font-weight: bolder;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`

export default class StopMarkerContent extends React.PureComponent<Props> {
  render() {
    return (
      <Query
        query={queries.STOP}
        variables={({ stopID: this.props.stopID } as any)}>
        {({ data, error, loading, refetch }) => {
          if (loading) return (<span>Loading</span>)
          if (error) return (<span>Error :(</span>)
          if (data) {
            const { stop }: StopResponse = data as any
            return (
              <>
                {stop.Lines.map((line, idx) => (
                  <React.Fragment key={idx}>
                    <LineInfo>
                      {line.Line.LineDescription}
                      {' '}
                      <small>{line.WaitMessage || 'Non disponibile'}</small>
                    </LineInfo>
                  </React.Fragment>
                ))}
                <RefreshSpan onClick={() => refetch()}>
                  Aggiorna
                </RefreshSpan>
              </>
            )
          }
          return null
        }}
      </Query>
    )
  }
}