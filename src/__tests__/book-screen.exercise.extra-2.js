// 🐨 here are the things you're going to need for this test:
import * as React from 'react'
import {
  loadCompletion,
  loginAsUser,
  getButton,
  queryButton,
  render,
  saveBook,
  screen,
} from 'test/app-test-utils.exercise.js'
import {App} from 'app'
import {formatDate} from 'utils/misc'
import userEvent from '@testing-library/user-event'

describe('Book Screen', () => {
  let book

  beforeEach(async () => {
    await loginAsUser()
    book = await saveBook()
    window.history.pushState({}, 'Test Book Screen', `/book/${book.id}`)
  })

  test('renders all the book information', async () => {
    await render(<App />)

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
    await render(<App/>)

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
