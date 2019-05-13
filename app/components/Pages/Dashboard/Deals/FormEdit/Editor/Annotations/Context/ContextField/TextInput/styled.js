import styled, { css } from 'styled-components'

import Cleave from 'cleave.js/react'

const inputStyle = css`
  border: 1px solid #ccc;
  width: 100%;
  height: 2.5rem;
  border-radius: 2px;
  padding: 0.5rem;
`

export const FormattedInput = styled(Cleave)`
  ${inputStyle}
`
export const BasicInput = styled.input`
  ${inputStyle}
`
