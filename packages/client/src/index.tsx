import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { injectGlobal } from 'styled-components'

import Map from './components/Map'

injectGlobal`
  html, body {
    height: 100%;
  }
  body {
    margin: 0;
  }
`

const client = new ApolloClient({ uri: 'http://localhost:3000' })

const body = document.body
const html = body.parentNode
if (!html) throw new Error('Unexpected condition')
const rootEl = document.createElement('div')
rootEl.style.setProperty('height', '100%')
body.appendChild(rootEl)

ReactDOM.render(
  <ApolloProvider client={client}>
    <Map client={client} />
  </ApolloProvider>,
  rootEl
)