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
      d="M17.385 18.923v1.545A1.53 1.53 0 0 1 15.853 22h-1.545v-1.538h1.538v-1.539h1.539zM12.769 22h-2.308v-1.538h2.308V22zm-3.846 0H6.615v-1.538h2.308V22zm-3.846 0H3.532A1.53 1.53 0 0 1 2 20.468v-1.545h1.538v1.538h1.539V22zM2 17.385v-2.308h1.538v2.308H2zm0-3.847v-2.307h1.538v2.307H2zm0-3.846V8.147a1.53 1.53 0 0 1 1.532-1.532h1.545v1.539H3.539v1.538H2zM20.468 2A1.53 1.53 0 0 1 22 3.532v12.321a1.53 1.53 0 0 1-1.532 1.532H8.147a1.53 1.53 0 0 1-1.532-1.532V3.532A1.53 1.53 0 0 1 8.147 2h12.321zM8.154 3.538v12.308h12.308V3.538H8.154zm10 7.693a.77.77 0 0 1-.77-.77V7.708l-4.84 4.837a.77.77 0 0 1-1.088-1.088l4.836-4.84h-2.754a.77.77 0 0 1 0-1.54h4.616a.77.77 0 0 1 .77.77v4.615a.77.77 0 0 1-.77.77z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconLink'
})
