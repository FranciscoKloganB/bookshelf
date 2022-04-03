import {useQuery} from 'react-query'
import {client} from 'utils/api-client'

import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

export function useBookSearch(query, user) {
  const queryResult = useQuery(['bookSearch', {query}], () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then(data => data.books),
  )

  return {...queryResult, books: queryResult.data ?? loadingBooks}
}
