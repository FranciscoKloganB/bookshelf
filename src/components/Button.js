import styled from '@emotion/styled'
import {primaryColor, secondaryColor, dangerColor} from './palette'

const buttonVariant = {
  primary: {
    background: primaryColor,
    color: 'white',
  },
  secondary: {
    background: secondaryColor,
    color: 'white',
  },
  danger: {
    background: dangerColor,
    color: 'white',
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
