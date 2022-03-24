// 🐨 you'll need to import React and ReactDOM up here
// 🐨 you'll also need to import the Logo component from './components/logo'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { Logo } from 'components/logo'

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked
function App(props) {
  function handleRegisterClick() {
    alert('handleRegisterClick clicked')
  }

  function handleLoginClick() {
    alert('Login clicked')
  }

  return (
    <div>
      <Logo />
      <h1>Bookshelf</h1>
      <button onClick={handleLoginClick}>Login</button>
      <button onClick={handleRegisterClick}>Register</button>
    </div>
  )
}

// 🐨 use ReactDOM to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
ReactDOM.render(<App />, document.getElementById('root'))
