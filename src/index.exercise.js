import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {App} from './app'
import {ReactQueryConfigProvider} from 'react-query'

const queryConfig = {
  queries: {
    // If an error occurs on a component which is eventually wrapped in ErrorBoundary, let it handle error
    useErrorBoundary: true,
    // Do not query backends when comming back to tab
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => error.status !== 404 && failureCount < 3,
  },
}

loadDevTools(() => {
  ReactDOM.render(
    <ReactQueryConfigProvider config={queryConfig}>
      <App />
    </ReactQueryConfigProvider>,
    document.getElementById('root'),
  )
})
