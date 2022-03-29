import styled from '@emotion/styled/macro'
import * as colors from 'styles/colors'

const inputVariant = {
  primary: {
    borderColor: colors.indigo,
  },
  secondary: {
    borderColor: colors.text,
  },
  danger: {
    borderColor: colors.danger,
  },
}

// 🐨 Feel free to create as many reusable styled components here as you'd like
// 💰 in my finished version I have: Button, Input, CircleButton, Dialog, FormGroup
export const Input = styled.input(
  {
    borderRadius: '8px',
    borderWidth: '1px',
    background: 'white',
    height: '30px',
    padding: '8px 12px',
  },
  ({variant = 'secondary'}) => inputVariant[variant],
)
