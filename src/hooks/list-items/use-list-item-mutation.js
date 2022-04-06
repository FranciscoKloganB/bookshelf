import {useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'

const onSettled = () => queryCache.invalidateQueries('list-items')
const defaultMutationOptions = {
  onSettled,
}

export function useListItemUpdateMutation(user, options) {
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        data: updates,
        method: 'PUT',
        token: user.token,
      }),
    {...defaultMutationOptions, ...options},
  )
}

export function useListItemCreateMutation(user, options) {
  return useMutation(
    bookId => client(`list-items`, {data: {bookId}, token: user.token}),
    {...defaultMutationOptions, ...options},
  )
}

export function useListItemRemoveMutation(user, options) {
  return useMutation(
    bookId =>
      client(`list-items/${bookId}`, {method: 'DELETE', token: user.token}),
    {...defaultMutationOptions, ...options},
  )
}
