import styled from '@emotion/styled/macro'
import * as colors from 'styles/colors'

const buttonVariant = {
  primary: {
    background: colors.indigo,
    color: colors.base,
  },
  secondary: {
    background: colors.gray,
    color: colors.text,
  },
  danger: {
    background: colors.danger,
    color: colors.base,
  },
}

export const Button = styled.button(
  {
    border: '0px',
    lineHeight: '1.5px',
    height: '30px',
    padding: '10px 15px',
    borderRadius: '8px',
  },
  ({variant = 'primary'}) => buttonVariant[variant],
)
