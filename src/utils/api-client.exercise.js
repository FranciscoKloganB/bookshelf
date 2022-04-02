import * as auth from 'auth-provider'

const apiURL = process.env.REACT_APP_API_URL

function client(endpoint, method = 'GET', {customHeaders, data, token, ...customConfig} = {}) {
  const config = {
    method: method,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json ': undefined,
      ...customHeaders,
    },
    body: data ? JSON.stringify(data) : undefined,
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()

    if (response.status === 401) {
      await auth.logout()
      window.location.assign(window.location)

      return Promise.reject({message: 'Please re-authenticate'})
    }

    if (response.ok) {
      return data
    }

    return Promise.reject(data)
  })
}

export {client}
