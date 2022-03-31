function client(
  endpoint,
  token = '',
  customConfig = {},
) {
  const config = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    ...customConfig,
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(async response => {
      const data = await response.json()
      return response.ok ? data : Promise.reject(data)
    })
}

export {client}
