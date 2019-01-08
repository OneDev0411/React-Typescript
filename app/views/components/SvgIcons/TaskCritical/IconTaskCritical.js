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
      d="M18.3 3H5.7C4.17 3 3 4.17 3 5.7v12.6C3 19.83 4.17 21 5.7 21h12.6c1.53 0 2.7-1.17 2.7-2.7V5.7C21 4.17 19.83 3 18.3 3zM5.7 4.8h.9v1.8h1.8V4.8h7.2v1.8h1.8V4.8h.9c.54 0 .9.36.9.9v1.8H4.8V5.7c0-.54.36-.9.9-.9zm12.6 14.4H5.7c-.54 0-.9-.36-.9-.9v-9h14.4v9c0 .54-.36.9-.9.9zm-7.2-8.1v3.6h1.8v-3.6h-1.8zm0 4.5v1.8h1.8v-1.8h-1.8z"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconTaskCritical'
})
