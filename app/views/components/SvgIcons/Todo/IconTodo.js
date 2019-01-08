import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 24 24'

const getDimensions = () => ({
  height,
  width
})

const getDimensionsCss = () => css`
  width: ${width}px;
  height: ${height}px;
`

const Image = styled.svg`
  ${({ noStyles }) => (!noStyles ? getDimensionsCss() : null)};
`

const defaultProps = {
  children: [
    <path
      key="key-0"
      fillRule="nonzero"
      d="M15.776 5.904c1.228 0 2.224.939 2.224 2.097v9.902C18 19.061 17.004 20 15.776 20H7.224C5.996 20 5 19.061 5 17.903v-9.9c0-1.158.996-2.097 2.224-2.097h.469v-.148c0-.386.332-.7.741-.7h.692c.373-.65 1.094-1.056 1.88-1.058h.989c.785.001 1.507.407 1.881 1.057h.69c.409 0 .741.313.741.699v.148h.469zm.741 12L16.52 8c0-.386-.332-.699-.741-.699h-.471v.222c0 .386-.332.699-.741.699h-6.13c-.41 0-.741-.313-.741-.7v-.221h-.47c-.41 0-.742.313-.742.699v9.902c0 .386.332.7.741.7h8.552c.41 0 .741-.314.741-.7zm-3.303-7.012v-.002a.852.852 0 0 1 .754-.205.758.758 0 0 1 .577.479c.082.24.014.5-.178.684l-2.71 2.596a.859.859 0 0 1-1.102.044l-1.868-1.489a.66.66 0 0 1-.25-.668.739.739 0 0 1 .526-.526.865.865 0 0 1 .774.141l1.293 1.03 2.184-2.084z"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconTodo'
})
