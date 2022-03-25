import * as React from 'react'

export function AuthForm({buttonText, onSubmit}) {
  function handleSubmit(event) {
    event.preventDefault()

    const credentials = {
      username: event.target.elements.username.value,
      password: event.target.elements.password.value,
    }

    console.log('AuthForm handleSubmit credentials', credentials)
    console.log('AuthForm handleSubmit onSubmit handler', onSubmit)

    onSubmit(credentials)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </div>
      <div>
        <button type="submit">{buttonText}</button>
      </div>
    </form>
  )
}
