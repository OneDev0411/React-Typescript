import styled from 'styled-components'

import { ComponentProps } from 'react'

import { green, red } from 'views/utils/colors'

import IconButton from '../Button/IconButton'

import { Callout } from '.'

export const BG_MAPPING: {
  [key in Required<ComponentProps<typeof Callout>>['type']]: string
} = {
  info: '#d8e6ff',
  warn: '#f8eab3',
  success: green.primary,
  error: red.A100
}

export const CalloutContainer = styled.div<
  Required<Pick<ComponentProps<typeof Callout>, 'type'>>
>`
  border-radius: 6px;
  padding: 0.75rem 1rem;
  margin: 1.5rem 1rem;
  background-color: ${({ type }) => BG_MAPPING[type]};
  display: flex;
  align-items: center;
`
export const CalloutContent = styled.div`
  flex: 1;
`

export const CalloutCloseButton = styled(IconButton)`
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  svg {
    margin: auto;
    fill: initial;
  }
`
