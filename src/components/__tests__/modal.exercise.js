// 🐨 you're gonna need this stuff:
// import {Modal, ModalContents, ModalOpenButton} from '../modal'
import * as React from 'react'
import {Modal, ModalContents, ModalOpenButton} from '../modal'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * We describe Modal, because Contents, Open and Dismiss buttons are children
 * of Modal on a compound component pattern -- It makes sense to test them
 * together.
 */
describe('Modal', () => {
  test('can be opened and closed', () => {
    const label = 'Modal Label'
    const title = 'Modal Title'
    const content = 'Modal content'

    // 🐨 render the Modal, ModalOpenButton, and ModalContents
    render(
      <Modal>
        <ModalOpenButton>
          <button>open</button>
        </ModalOpenButton>
        <ModalContents aria-label={label} title={title}>
          <p>{content}</p>
        </ModalContents>
      </Modal>,
    )

    // 🐨 click the open button
    // 🐨 verify the modal contains the modal contents, title, and label
    userEvent.click(screen.getByRole('button', {name: /open/i}))

    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-label', label)

    const withinModal = within(modal)
    expect(withinModal.getByText(content)).toBeInTheDocument()
    expect(withinModal.getByRole('heading', {name: title})).toBeInTheDocument()

    // 🐨 click the close button
    // 🐨 verify the modal is no longer rendered
    // 💰 (use `query*` rather than `get*` or `find*` queries to verify it is not rendered)
    userEvent.click(withinModal.getByRole('button', {name: /close/i}))
    expect(screen.queryByRole('dialog')).toBe(null)
  })
})
