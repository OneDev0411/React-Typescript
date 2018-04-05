import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 100 100'

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
      d="M40.13 75.108L27.527 42.354l10.538-4.056 7.068 18.369L90.422 20.48l7.045 8.826z"
      key="key-0"
    />,
    <path
      d="M73.393 54.837v22.825H20.071V24.34h53.322v4.745l7.529-6.01v-6.263H12.543V85.19h68.379V48.828z"
      key="key-1"
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
