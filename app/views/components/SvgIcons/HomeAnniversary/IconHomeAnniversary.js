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
      key="1"
      fillRule="nonzero"
      d="M18.673 10.962l.615.507a1.031 1.031 0 0 0 1.48-.168 1.103 1.103 0 0 0-.163-1.522l-7.947-6.541a1.031 1.031 0 0 0-1.317 0L3.395 9.779a1.103 1.103 0 0 0-.164 1.522 1.034 1.034 0 0 0 1.481.168l.616-.507v8.955c0 .598.471 1.083 1.053 1.083h11.238c.582 0 1.054-.485 1.054-1.083v-8.955zM7.435 18.835V9.228L12 5.47l4.565 3.758v9.607h-9.13z"
    />,
    <path
      key="2"
      fillRule="nonzero"
      d="M10.65 11c-.425 0-.851.164-1.17.494a1.724 1.724 0 0 0 0 2.385l2.28 2.354a.333.333 0 0 0 .476 0c.76-.784 1.524-1.569 2.284-2.354.64-.66.64-1.722 0-2.382a1.63 1.63 0 0 0-2.34 0l-.18.185-.18-.188A1.624 1.624 0 0 0 10.65 11z"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconHomeAnniversary'
})
