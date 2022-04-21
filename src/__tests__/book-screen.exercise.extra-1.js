// 🐨 here are the things you're going to need for this test:
import * as React from 'react'
import * as auth from 'auth-provider'
import * as usersDB from 'test/data/users'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import {queryCache} from 'react-query'
import {buildUser, buildBook} from 'test/generate'
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

  const user = buildUser()
  const book = buildBook()
  const originalFetch = window.fetch
  const route = `/book/${book.id}`
  const token = 'token'

  beforeAll(() => {
    jest.spyOn(window, 'fetch')

    window.fetch = mockFetch
    window.history.pushState({}, 'Test Book Screen', route)
  })

  afterAll(() => {
    window.fetch = originalFetch
  })

  beforeEach(() => {
    window.localStorage.setItem(auth.localStorageKey, token)
  })

  afterEach(async () => {
    queryCache.clear()
    await auth.logout()
  })

  test('renders all the book information', async () => {
    render(<App />, {wrapper: AppProviders})

    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

    expect(screen.getByRole('img', {name: /book cover/i})).toHaveAttribute(
      'src',
      book.coverImageUrl,
    )
    expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument()
    expect(screen.getByText(book.author)).toBeInTheDocument()
    expect(screen.getByText(book.publisher)).toBeInTheDocument()
    expect(screen.getByText(book.synopsis)).toBeInTheDocument()

    expect(
      screen.getByRole('button', {name: /add to list/i}),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', {name: /remove from list/i}),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', {name: /mark as read/i}),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', {name: /mark as unread/i}),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('textbox', {name: /notes/i}),
    ).not.toBeInTheDocument()

    expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
  })
})
