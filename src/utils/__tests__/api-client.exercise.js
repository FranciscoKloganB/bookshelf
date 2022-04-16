// 🐨 you'll need the test server
// 🐨 grab the client
// 💰 the way that our tests are set up, ind this in `src/test/server/test-server.js`
import {server, rest} from 'test/server'
import {client} from 'utils/api-client'

const apiURL = process.env.REACT_APP_API_URL
const endpoint = 'test-endpoint'

describe('api-client', () => {
  // 🐨 add a beforeAll to start the server with `server.listen()`
  beforeAll(() => {
    server.listen()
  })

  // 🐨 add an afterAll to stop the server when `server.close()`
  afterAll(() => {
    server.close()
  })

  // 🐨 afterEach test, reset the server handlers to their original handlers
  // via `server.resetHandlers()`
  afterEach(() => {
    server.resetHandlers()
  })

  // 🐨 flesh these out:
  test('fetches at endpoint with the arguments for GET requests', async () => {
    const mockResult = {mockValue: 'VALUE'}
    // 🐨 add a server handler to handle a test request you'll be making
    // 💰 because this is the first one, I'll give you the code for how to do that.
    // Even tho our MWS Server is configured for test-environment, we want to
    // redefine our endpoints here, to mock our server mocks =)
    server.use(
      rest.get(`${apiURL}/${endpoint}`, async (_req, res, ctx) => {
        return res(ctx.json(mockResult))
      }),
    )

    // 🐨 call the client (don't forget that it's asynchronous)
    const result = await client(endpoint)
    // 🐨 assert that the resolved value from the client call is correct
    expect(result).toEqual(mockResult)
  })

  describe('when configuration is provided', () => {
    test('adds auth token when a token is given', async () => {
      // 🐨 create a "request" variable with let
      let request
      // 🐨 create a server handler for the request you'll be testing
      // 🐨 inside the server handler, assign "request" to "req" use that to assert things later
      server.use(
        rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
          request = req
          return res(ctx.json({}))
        }),
      )

      // 🐨 create a fake token (it can be set to any string you want)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
      // 🐨 call the client with the token (note that it's async)
      await client(endpoint, {token})
      // 🐨 verify that `request.headers.get('Authorization')` is correct
      expect(request.headers.get('Authorization')).toEqual(`Bearer ${token}`)
    })

    test('overrides custom configuration', async () => {
      // 🐨 create a "request" variable with let
      let request
      // 🐨 create a server handler for the request you'll be testing
      // 🐨 inside the server handler, assign "request" to "req" use that to assert things later
      server.use(
        rest.put(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
          request = req
          return res(ctx.json({}))
        }),
      )

      // 🐨 create a custom config that specifies "mode" of "cors" and a custom header
      const data = 'world'
      const mode = 'cors'
      const contentType = 'application/xml'
      const customConfig = {
        data,
        method: 'PUT',
        headers: {
          mode,
          'Content-Type': contentType,
        },
      }

      // 🐨 call the client with the endpoint and the custom config
      await client(endpoint, customConfig)

      // 🐨 verify the request had the correct properties
      expect(request.headers.get('mode')).toEqual(mode)
      expect(request.headers.get('content-type')).toEqual(contentType)
      expect(request.body).toEqual('"world"')
    })
  })

  describe('when data is provided', () => {
    const data = {hello: 'world'}

    beforeEach(() => {
      // 🐨 create a server handler very similar to the previous ones
      server.use(
        rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
          return res(ctx.json(req.body))
        }),
      )
    })

    test('stringifies data and defaults to post method', async () => {
      // 🐨 call client with an endpoint and an object with the data
      const result = await client(endpoint, {data})
      // 🐨 verify the request.body is equal to the mock data object you passed
      expect(result).toEqual(data)
    })
  })

  describe('when the response is an error', () => {
    const errorResponse = {message: 'this is the response!'}

    test('returns the error data fetched from the endpoint', async () => {
      server.use(
        rest.get(`${apiURL}/${endpoint}`, async (_req, res, ctx) => {
          return res(ctx.status(400), ctx.json(errorResponse))
        }),
      )

      await expect(client(endpoint)).rejects.toEqual(errorResponse)
    })
  })
})
