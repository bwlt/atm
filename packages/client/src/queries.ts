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
        }
      }
      Stops {
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
        }>
      }>
    },
    Stops: Array<{
      Description: string,
      Location: {
        X: number,
        Y: number
      }
    }>
  }
}

// const STOP = gql`
//   query STOP($stopID: ID!) {
//     stop(id: $stopID) {
//       Lines {
//         Line {
//           LineDescription
//         }
//         WaitMessage
//       }
//     }
//   }
// `