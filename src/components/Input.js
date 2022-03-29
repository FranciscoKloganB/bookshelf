import styled from '@emotion/styled/macro'
import { primaryColor, secondaryColor, dangerColor } from './palette'

const inputVariant = {
  primary: {
    borderColor: primaryColor,
  },
  secondary: {
    borderColor: secondaryColor,
  },
  danger: {
    borderColor: dangerColor,
  },
}

// 🐨 Feel free to create as many reusable styled components here as you'd like
// 💰 in my finished version I have: Button, Input, CircleButton, Dialog, FormGroup
export const Input = styled.input(
  {
    borderRadius: '8px',
    borderWidth: '2px',
    background: 'white',
    height: '30px',
    padding: '8px 12px',
  },
  ({variant = 'secondary'}) => inputVariant[variant],
)
