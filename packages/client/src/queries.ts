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
export interface JourneyPatternSlim {
  Id: string,
  Line: {
    LineDescription: string,
  }
}

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
        BoundingBox_NE {
          X
          Y
        }
        BoundingBox_SW {
          X
          Y
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
export interface JourneyPattern {
  Geometry: {
    Segments: Array<{
      Points: Array<{
        X: number,
        Y: number
      }>,
      RGB: string
    }>,
    BoundingBox_NE: {
      X: number,
      Y: number,
    },
    BoundingBox_SW: {
      X: number,
      Y: number,
    }
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
export interface JourneyPatternResponse {
  journeyPattern: JourneyPattern
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
export interface Stop {
  Lines: Array<{
    Line: {
      LineDescription: string
    },
    WaitMessage: string
  }>
}
export interface StopResponse {
  stop: Stop
}