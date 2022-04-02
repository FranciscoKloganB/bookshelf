/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
// 🐨 you're going to need this:
import * as auth from 'auth-provider'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {client} from 'utils/api-client.exercise'
import {useAsync} from 'utils/hooks'
import {FullPageSpinner} from 'components/lib'
import {AuthError} from 'components/auth-error'

async function getUser() {
  const token = await auth.getToken()

  if (token) {
    const data = await client('me', {token})

    return data?.user
  }

  return null
}

function App() {
  // 🐨 useState for the user
  const {
    data: user,
    error,
    isIdle,
    isLoading,
    isError,
    run,
    setData: setUser,
  } = useAsync(null)

  React.useEffect(() => {
    run(getUser())
  }, [run])

  // 🐨 create a login function that calls auth.login then sets the user
  // 💰 const login = form => auth.login(form).then(u => setUser(u))
  function login(form) {
    return auth.login(form).then(u => setUser(u))
  }

  // 🐨 create a registration function that does the same as login except for register
  function register(form) {
    return auth.register(form).then(u => setUser(u))
  }

  // 🐨 create a logout function that calls auth.logout() and sets the user to null
  function logout(form) {
    return auth.logout(form).then(() => setUser(null))
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <AuthError error={error} />
  }

  // 🐨 if there's a user, then render the AuthenticatedApp with the user and logout
  // 🐨 if there's not a user, then render the UnauthenticatedApp with login and register
  return user ? (
    <AuthenticatedApp user={user} logout={logout} />
  ) : (
    <UnauthenticatedApp login={login} register={register} />
  )
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
