import * as React from 'react'
import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {App} from 'app'
import {AppProviders} from 'context'
import * as auth from 'auth-provider'
import {buildBook, buildListItem, buildUser} from 'test/generate'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import * as usersDB from 'test/data/users'

/**
 * If you want to render the app unauthenticated then pass "null" as the user
 */
async function render(ui, {route = '/list', user, ...renderOptions} = {}) {
  user = typeof user === 'undefined' ? await loginAsUser() : user
  window.history.pushState({}, 'Test page', route)

  const renderValues = {
    ...rtlRender(ui, {wrapper: AppProviders, ...renderOptions}),
    user,
  }

  await waitForLoadingToFinish()

  return renderValues
}

async function renderBookScreen({user, book, listItem, ...renderOptions} = {}) {
  user = user === undefined ? await loginAsUser() : user
  book = book === undefined ? await booksDB.create(buildBook()) : book

  if (listItem === undefined) {
    listItem = await listItemsDB.create(buildListItem({owner: user, book}))
  }

  const route = `/book/${book.id}`
  const renderValues = await render(<App />, {
    route,
    user,
    renderOptions,
  })

  return {
    ...renderValues,
    book,
    listItem,
    user,
  }
}

async function loginAsUser(userProperties) {
  const user = buildUser(userProperties)
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(auth.localStorageKey, authUser.token)
  return authUser
}

const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ])

export * from '@testing-library/react'
export {
  render,
  renderBookScreen,
  userEvent,
  loginAsUser,
  waitForLoadingToFinish,
}
