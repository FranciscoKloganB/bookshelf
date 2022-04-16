import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {App} from './app'
import {AppProviders} from './context'
import {Profiler} from 'components/profiler'

loadDevTools(() => {
  ReactDOM.render(
    <Profiler profilerId={'App'} phases={['mount']}>
      <AppProviders>
        <App />
      </AppProviders>
    </Profiler>,
    document.getElementById('root'),
  )
})
