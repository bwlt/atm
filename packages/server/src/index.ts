import qs from 'querystring'
import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'

const PORT = process.env.PORT
if (!PORT) throw new Error(`Missing required environment variable 'PORT'`)

interface Ctx {
  models: {
    journeyPatterns: JourneyPatterns,
    stops: Stops
  }
}

class JourneyPatterns {
  get(id: string) {
    return fetch('http://giromilano.atm.it/proxy.ashx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: qs.stringify({ url: `tpPortal/tpl/journeyPatterns/${id}` })
    })
      .then(response => response.json())
  }
  list() {
    return fetch('http://giromilano.atm.it/proxy.ashx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: qs.stringify({ url: 'tpPortal/tpl/journeyPatterns' })
    })
      .then(response => response.json())
      .then(json => json.JourneyPatterns)
  }
}

class Stops {
  get(id: String) {
    return fetch('http://giromilano.atm.it/proxy.ashx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: qs.stringify({ url: `tpPortal/geodata/pois/stops/${id}` })
    })
      .then(response => response.json())
  }
}


const typeDefs = `
  type Link {
    Rel:   String
    Href:  String
    Title: String
  }
  type Line {
    OperatorCode:         String
    LineCode:             String
    LineDescription:      String
    Suburban:             Boolean
    TransportMode:        Int
    OtherRoutesAvailable: Boolean
  }
  type StopLine {
    BookletUrl:       String
    Direction:        String
    JourneyPatternId: String
    Line:             Line
    WaitMessage:      String
  }
  type Location {
    X: Float
    Y: Float
  }
  type Segment {
    RGB:    String
    Points: [Location!]
  }
  type Geometry {
    BoundingBox_NE: Location
    BoundingBox_SW: Location
    Segments:       [Segment!]
  }
  type Stop {
    Address:      String
    Code:         ID!
    Description:  String
    Links:        String
    Lines:        [StopLine]
    Location:     Location
    OperatorCode: String
    OtherLines:   String
    PointType:    Int
  }
  type JourneyPattern {
    Id:        ID!
    Code:      String
    Direction: String
    Line:      Line
    Stops:     [Stop!]
    Geometry:  Geometry
    Links:     [Link!]
  }
  type Query {
    journeyPatterns: [JourneyPattern!]!
    journeyPattern(id: ID!): JourneyPattern
    stop(id: ID!): Stop
  }
`

const resolvers = {
  Query: {
   journeyPatterns: (_source: never, _args: never, { models: { journeyPatterns } }: Ctx) => journeyPatterns.list(),
   journeyPattern: (_source: never, { id }: { id: string }, { models: { journeyPatterns } }: Ctx) => journeyPatterns.get(id),
   stop: (_source: never, { id }: { id: string }, { models: { stops } }: Ctx) => stops.get(id),
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const app = express()

app.get('*', graphiqlExpress({ endpointURL: '/' }))

app.use(cors(), bodyParser.json(), graphqlExpress(() => {
  const context: Ctx = {
    models: {
      journeyPatterns: new JourneyPatterns(),
      stops: new Stops()
    }
  }
  return {
    context,
    schema
  }
}))

app.listen(PORT, () => {
  console.log(`Server started on 'http://localhost:${PORT}'`)
})