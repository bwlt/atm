import { gql } from 'apollo-boost'

export const JOURNEY_PATTERNS = gql`
  query JourneyPatterns {
    journeyPatterns {
      Id
      Line {
        LineDescription
      }
    }
  }
`

export const JOURNEY_PATTERN = gql`
  query JOURNEY_PATTERN($id: ID!) {
    journeyPattern(id: $id) {
      Geometry {
        Segments {
          Points {
            X
            Y
          }
          RGB
        }
      }
      Stops {
        Code
        Description
        Location {
          X
          Y
        }
      }
    }
  }
`
export interface JourneyPatternResponse {
  journeyPattern: {
    Geometry: {
      Segments: Array<{
        Points: Array<{
          X: number,
          Y: number
        }>,
        RGB: string
      }>
    },
    Stops: Array<{
      Code: string,
      Description: string,
      Location: {
        X: number,
        Y: number
      }
    }>
  }
}

export const STOP = gql`
  query STOP($stopID: ID!) {
    stop(id: $stopID) {
      Lines {
        Line {
          LineDescription
        }
        WaitMessage
      }
    }
  }
`
export interface StopResponse {
  stop: {
    Lines: Array<{
      Line: {
        LineDescription: string
      },
      WaitMessage: string
    }>
  }
}