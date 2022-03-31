/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import Tooltip from '@reach/tooltip'
import {FaSearch, FaTimes} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from './components/lib'
import {BookRow} from './components/book-row'
import {client} from './utils/api-client'
import {useAsync} from 'utils/hooks'
import * as colors from './styles/colors'

function DiscoverBooksContent({data, error, isError, isSuccess}) {

  console.log(data, error, isError, isSuccess)

  if (isSuccess) {
    return data?.books?.length ? (
      <BookListUL css={{marginTop: 20}}>
        {data.books.map(book => (
          <li key={book.id} aria-label={book.title}>
            <BookRow key={book.id} book={book} />
          </li>
        ))}
      </BookListUL>
    ) : (
      <p>No books found. Try another search.</p>
    )
  }

  if (isError) {
    return (
      <div css={{color: colors.danger}}>
        <p>There was an error:</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

  return null
}

function DiscoverBooksScreen() {
  const {data, error, run, isLoading, isError, isSuccess} = useAsync()
  const [query, setQuery] = React.useState(null)
  const [queried, setQueried] = React.useState(false)

  // 🐨 Add a useEffect callback here for making the request with the client and updating the status and data.
  React.useEffect(() => {
    // 🐨 you'll also notice that we don't want to run the search until the user has submitted the form, so you'll need a boolean for that as well
    if (!queried) {
      return
    }

    run(client(`books?query=${encodeURIComponent(query)}`))
    // 🐨 remember, effect callbacks are called on the initial render too
  }, [queried, query, run])

  function handleSearchSubmit(event) {
    // 🐨 call preventDefault on the event so you don't get a full page reload
    event.preventDefault()
    // 🐨 set the queried state to true
    setQueried(true)
    // 🐨 set the query value which you can get from event.target.elements
    // 💰 console.log(event.target.elements) if you're not sure.
    setQuery(event.target.elements.search.value)
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? (
                <Spinner />
              ) : isError ? (
                <FaTimes aria-label="error" css={{color: colors.danger}} />
              ) : (
                <FaSearch aria-label="search" />
              )}
            </button>
          </label>
        </Tooltip>
      </form>
      <DiscoverBooksContent
        data={data}
        error={error}
        isError={isError}
        isSuccess={isSuccess}
      />
    </div>
  )
}

export {DiscoverBooksScreen}
