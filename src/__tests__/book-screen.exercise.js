// 🐨 here are the things you're going to need for this test:
import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {queryCache} from 'react-query'
import {buildUser, buildBook} from 'test/generate'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import {App} from 'app'

describe('Book Screen', () => {
  async function mockFetch(url, config) {
    return Promise.resolve({
      ok: true,
      json: async () => {
        if (url.endsWith('/bootstrap')) {
          return {
            user: {
              ...user,
              token,
            },
            listItems: [],
          }
        }

        if (url.endsWith('/list-items')) {
          return {listItems: []}
        }

        if (url.endsWith(`/books/${book.id}`)) {
          return {book}
        }

        return Promise.reject(
          new Error(`MUST HANDLE '${url}' with given config: ${config}`),
        )
      },
    })
  }

  // 🐨 create a user using `buildUser`
  // 🐨 create a book use `buildBook`
  const user = buildUser()
  const book = buildBook()
  const originalFetch = window.fetch
  const route = `/book/${book.id}`
  const token = 'token'

  beforeAll(() => {
    jest.spyOn(window, 'fetch')

    // 🐨 reassign window.fetch to another function and handle the following requests:
    // - url ends with `/bootstrap`: respond with {user, listItems: []}
    // - url ends with `/list-items`: respond with {listItems: []}
    // - url ends with `/books/${book.id}`: respond with {book}
    // 💰 window.fetch = async (url, config) => { /* handle stuff here*/ }
    // 💰 return Promise.resolve({ok: true, json: async () => ({ /* response data here */ })})
    window.fetch = mockFetch

    // 🐨 "authenticate" the client by setting the auth.localStorageKey in localStorage to some string value
    window.localStorage.setItem(auth.localStorageKey, token)

    // 🐨 update the URL to `/book/${book.id}`
    //   💰 window.history.pushState({}, 'page title', route)
    //   📜 https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
    window.history.pushState({}, 'Test Book Screen', route)
  })

  afterAll(() => {
    window.localStorage.removeItem(auth.localStorageKey)
    window.fetch = originalFetch
  })

  afterEach(() => {
    // 🐨 after each test, clear the queryCache and auth.logout
    queryCache.clear()
  })

  test('renders all the book information', async () => {
    // 🐨 render the App component and set the wrapper to the AppProviders
    // (that way, all the same providers we have in the app will be available in our tests)
    render(<App />, {wrapper: AppProviders})

    // 🐨 use waitFor to wait for the queryCache to stop fetching and the loading indicators to go away
    // 📜 https://testing-library.com/docs/dom-testing-library/api-async#waitfor
    // 💰 if (queryCache.isFetching or there are loading indicators) then throw an error...
    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

    // 🐨 assert the book's info is in the document
  })
})
