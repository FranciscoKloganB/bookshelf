// 🐨 you'll need to import React and ReactDOM up here
// 🐨 you'll also need to import the Logo component from './components/logo'
import '@reach/dialog/styles.css'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { Logo } from 'components/logo'
import { AuthForm } from 'components/auth/form'
import { Dialog } from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'

export function AuthFormCloseButton({close}) {
  return (
    <button className="close-button" onClick={close}>
      <VisuallyHidden>Close</VisuallyHidden>
      <span aria-hidden>×</span>
    </button>
  )
}

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked
function App() {
  const [openModal, setOpenModal] = React.useState('none')
  const closeModal = () => setOpenModal('none')
  const openLoginModal = () => setOpenModal('login')
  const openRegisterModal = () => setOpenModal('register')


  function login(formData) {
    console.log('login', formData)
  }

  function register(formData) {
    console.log('register', formData)
  }

  return (
    <div>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={openLoginModal}>Login</button>
      </div>
      <div>
        <button onClick={openRegisterModal}>Register</button>
      </div>
      <Dialog aria-label="Login form" isOpen={openModal === 'login'}>
        <AuthFormCloseButton close={closeModal} />
        <h3>Login</h3>
        <AuthForm onSubmit={login} buttonText="Login" />
      </Dialog>
      <Dialog aria-label="Registration form" isOpen={openModal === 'register'}>
        <AuthFormCloseButton close={closeModal} />
        <h3>Register</h3>
        <AuthForm onSubmit={register} buttonText="Register" />
      </Dialog>
    </div>
  )
}

// 🐨 use ReactDOM to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
ReactDOM.render(<App />, document.getElementById('root'))
