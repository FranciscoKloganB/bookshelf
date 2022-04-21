import * as auth from 'auth-provider'
import * as usersDB from 'test/data/users'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import {buildBook} from 'test/generate'
import {buildListItem} from 'test/generate'
import {buildUser} from 'test/generate'

import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import {AppProviders} from 'context'

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

async function loginAsUser(userProperties) {
  const user = buildUser(userProperties)
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(auth.localStorageKey, authUser.token)

  return [user, authUser]
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

async function saveBook(bookProperties) {
  const book = buildBook(bookProperties)
  await booksDB.create(book)
  return book
}

async function saveListItem(listItemProperties) {
  await listItemsDB.create(buildListItem(listItemProperties))
}
// Export everything from react testing library
export * from '@testing-library/react'
// Overrides render function from the previous export
export {
  getButton,
  queryButton,
  loadCompletion,
  loginAsUser,
  render,
  saveBook,
  saveListItem,
}
