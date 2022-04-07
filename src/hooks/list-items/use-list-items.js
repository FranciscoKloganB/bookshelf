import {useQuery} from 'react-query'
import {client} from 'utils/api-client'
import {setQueryDataForBook} from 'hooks/book'

export function useListItems(user) {
  const queryResult = useQuery(
    'list-items',
    () =>
      client('list-items', {token: user.token}).then(data => data.listItems),
    {
      onSuccess(items) {
        items.forEach(item => setQueryDataForBook(item.book))
      },
    },
  )

  return {...queryResult, listItems: queryResult.data ?? []}
}
