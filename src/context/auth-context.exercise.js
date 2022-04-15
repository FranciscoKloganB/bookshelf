/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {client} from 'utils/api-client'
import {useAsync} from 'utils/hooks'
import {FullPageSpinner, FullPageErrorFallback} from 'components/lib'

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

function AuthProvider(props) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
    status,
  } = useAsync()

  React.useEffect(() => {
    const userPromise = getUser()
    run(userPromise)
  }, [run])

  const register = React.useCallback(
    form => auth.register(form).then(user => setData(user)),
    [setData]
  )
  const login = React.useCallback(
    form => auth.login(form).then(user => setData(user)),
    [setData]
  )
  const logout = React.useCallback(() => {
    auth.logout()
    setData(null)
  }, [setData])

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    // Since this application never changes the value of user, it is not worth
    // it to add React.useMemo complexity to this value constant. We add
    // useCallback to the functions, because this allows consumers of this
    // provider to specify the functions in the dependency arrays.
    // If we wanted to memoize user, we could move `value` constant out of
    // the conditional statement, and memoize the entire object, specifying
    // each value as a dependency of Memo. Finally, passing the memoized value
    // to the provider value prop.
    const value = {user, login, register, logout}

    return <AuthContext.Provider value={value} {...props} />
  }

  throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

function useClient() {
  const {
    user: {token},
  } = useAuth()
  return React.useCallback(
    (endpoint, config) => client(endpoint, {...config, token}),
    [token],
  )
}

export {AuthProvider, useAuth, useClient}
