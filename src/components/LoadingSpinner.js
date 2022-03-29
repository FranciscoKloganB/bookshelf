import { keyframes } from '@emotion/core'
import styled from '@emotion/styled/macro'
import {FaSpinner} from 'react-icons/fa'

const spin = keyframes({
  '0%': {transform: 'rotate(0deg)'},
  '100%': {transform: 'rotate(360deg)'},
})

const Spinner = styled(FaSpinner)({
  animation: `${spin} 1s linear infinite`
})

Spinner.defaultProps = {
  'aria-label': 'loading'
}

export { Spinner }
