import {useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'

const onSettled = () => queryCache.invalidateQueries('list-items')

export function useListItemUpdateMutation(user) {
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        data: updates,
        method: 'PUT',
        token: user.token,
      }),
    {onSettled},
  )
}

export function useListItemCreateMutation(user) {
  return useMutation(
    bookId => client(`list-items`, {data: {bookId}, token: user.token}),
    {onSettled},
  )
}

export function useListItemRemoveMutation(user) {
  return useMutation(
    bookId =>
      client(`list-items/${bookId}`, {method: 'DELETE', token: user.token}),
    {onSettled},
  )
}
