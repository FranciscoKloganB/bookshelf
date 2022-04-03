import {useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'

const onSettled = () => queryCache.invalidateQueries('list-items')

export function useListItemUpdateMutation(user) {
  const [update] = useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        data: updates,
        method: 'PUT',
        token: user.token,
      }),
    {onSettled},
  )

  return update
}

export function useListItemCreateMutation(user) {
  const [create] = useMutation(
    bookId => client(`list-items`, {data: {bookId}, token: user.token}),
    {onSettled},
  )

  return create
}

export function useListItemRemoveMutation(user) {
  const [remove] = useMutation(
    bookId =>
      client(`list-items/${bookId}`, {method: 'DELETE', token: user.token}),
    {onSettled},
  )

  return remove
}
