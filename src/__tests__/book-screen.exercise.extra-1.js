// 🐨 here are the things you're going to need for this test:
import * as React from 'react'
import * as auth from 'auth-provider'
import * as usersDB from 'test/data/users'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import {queryCache} from 'react-query'
import {buildUser, buildBook} from 'test/generate'
import {AppProviders} from 'context'
import {App} from 'app'
import {formatDate} from 'utils/misc'
import userEvent from '@testing-library/user-event'

async function loadCompletion() {
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
}

function getButton(config) {
  return screen.getByRole('button', config)
}

function queryButton(config) {
  return screen.queryByRole('button', config)
}

async function render(ui, options) {
  const result = await rtlRender(ui, {wrapper: AppProviders, ...options})

  await loadCompletion()

  return result
}

async function loginAsUser(userProperties) {
  const user = buildUser(userProperties)
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(auth.localStorageKey, authUser.token)

  return [user, authUser]
}

async function saveBook(bookProperties) {
  const book = buildBook(bookProperties)
  await booksDB.create(book)
  return book
}

describe('Book Screen', () => {
  let book

  beforeEach(async () => {
    await loginAsUser()
    book = await saveBook()
    window.history.pushState({}, 'Test Book Screen', `/book/${book.id}`)
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
    await render(<App />, {wrapper: AppProviders})

    expect(screen.getByRole('img', {name: /book cover/i})).toHaveAttribute(
      'src',
      book.coverImageUrl,
    )
    expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument()
    expect(screen.getByText(book.author)).toBeInTheDocument()
    expect(screen.getByText(book.publisher)).toBeInTheDocument()
    expect(screen.getByText(book.synopsis)).toBeInTheDocument()

    expect(getButton({name: /add to list/i})).toBeInTheDocument()
    expect(queryButton({name: /remove from list/i})).not.toBeInTheDocument()
    expect(queryButton({name: /mark as read/i})).not.toBeInTheDocument()
    expect(queryButton({name: /mark as unread/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
    expect(
      screen.queryByRole('textbox', {name: /notes/i}),
    ).not.toBeInTheDocument()
  })

  test('can create a list item for the book', async () => {
    await render(<App />)

    const addToListButton = getButton({name: /add to list/i})
    userEvent.click(addToListButton)
    expect(addToListButton).toBeDisabled()

    await loadCompletion()

    expect(queryButton({name: /mark as read/i})).toBeInTheDocument()
    expect(queryButton({name: /remove from list/i})).toBeInTheDocument()
    expect(queryButton({name: /mark as unread/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox', {name: /notes/i})).toBeInTheDocument()
    expect(screen.queryByLabelText(/start date/i)).toHaveTextContent(
      formatDate(Date.now()),
    )
  })
})
