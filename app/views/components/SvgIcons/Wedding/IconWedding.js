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
      key="0"
      fillRule="nonzero"
      d="M7.948 4c-1.274 0-2.55.492-3.51 1.481-1.919 1.98-1.916 5.176 0 7.157L11.28 19.7a1 1 0 0 0 1.427 0c2.281-2.354 4.572-4.708 6.853-7.062 1.919-1.98 1.919-5.167 0-7.146a4.891 4.891 0 0 0-7.02 0l-.54.553-.541-.564A4.871 4.871 0 0 0 7.948 4zm0 1.972c.743 0 1.487.303 2.073.907l1.26 1.304a1 1 0 0 0 1.437 0l1.26-1.293c1.172-1.209 2.975-1.209 4.146 0a3.145 3.145 0 0 1 0 4.36c-2.042 2.107-4.082 4.215-6.125 6.322L5.875 11.24a3.145 3.145 0 0 1 0-4.36c.586-.605 1.33-.908 2.073-.908z"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconWedding'
})
