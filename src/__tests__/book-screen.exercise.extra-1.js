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
  let authUser
  let user
  let book
  let route

  beforeEach(async () => {
    user = buildUser()
    await usersDB.create(user)

    book = buildBook()
    route = `/book/${book.id}`
    await booksDB.create(book)

    authUser = await usersDB.authenticate(user)
    window.localStorage.setItem(auth.localStorageKey, authUser.token)

    window.history.pushState({}, 'Test Book Screen', route)
  })

  afterEach(async () => {
    queryCache.clear()
    await Promise.all([
      auth.logout(),
      usersDB.reset(),
      booksDB.reset(),
      listItemsDB.reset(),
    ])
  })

  test('renders all the book information', async () => {
    render(<App />, {wrapper: AppProviders})

    /**
     * Since we are now waiting for the auth user as well as other
     * data asynchronously, such as the book, we need to wait for more spinners
     * to be removed from the page other than the initial "login" one which
     * corresponded to the full page spinner
     */
    await waitForElementToBeRemoved(() => [
      ...screen.queryAllByLabelText(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ])

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
