import {queryCache, useQuery} from 'react-query'
import {client} from 'utils/api-client'

export function useListItems(user) {
  const queryResult = useQuery(
    'list-items',
    () =>
      client('list-items', {token: user.token}).then(data => data.listItems),
    {
      onSuccess(items) {
        items.forEach(item => {
          queryCache.setQueryData(['book', {bookId: item.book.id}], item.book)
        })
      },
    },
  )

  return {...queryResult, listItems: queryResult.data ?? []}
}
