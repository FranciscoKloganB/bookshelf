// 🐨 you're gonna need this stuff:
// import {Modal, ModalContents, ModalOpenButton} from '../modal'
import {Modal, ModalContents, ModalOpenButton} from 'component/modal'

/**
 * We describe Modal, because Contents, Open and Dismiss buttons are children
 * of Modal on a compound component pattern -- It makes sense to test them
 * together.
 */
describe('Modal', () => {
  test('can be opened and closed', () => {
    // 🐨 render the Modal, ModalOpenButton, and ModalContents
    // 🐨 click the open button
    // 🐨 verify the modal contains the modal contents, title, and label
    // 🐨 click the close button
    // 🐨 verify the modal is no longer rendered
    // 💰 (use `query*` rather than `get*` or `find*` queries to verify it is not rendered)
  })
})
