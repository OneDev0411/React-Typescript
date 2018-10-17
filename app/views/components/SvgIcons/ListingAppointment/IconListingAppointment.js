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
      d="M12 5.403A6.604 6.604 0 0 1 18.597 12 6.604 6.604 0 0 1 12 18.597 6.604 6.604 0 0 1 5.403 12 6.605 6.605 0 0 1 12 5.403zM12 4a8 8 0 0 0-8 8c0 4.42 3.581 8 8 8 4.419 0 8-3.58 8-8a8 8 0 0 0-8-8zm3.746 10.972a.635.635 0 0 0-.103-.892l-3.01-2.387.001-2.513a.634.634 0 1 0-1.268 0V12c0 .194.088.377.239.497l3.25 2.578a.633.633 0 0 0 .892-.103zM12 6.35a.743.743 0 1 0 0 1.486.743.743 0 0 0 0-1.486zm4.924 4.906a.743.743 0 1 0 0 1.486.743.743 0 0 0 0-1.486zM12 16.182a.743.743 0 1 0 0 1.486.743.743 0 0 0 0-1.486zm-4.924-4.925a.743.743 0 1 0-.001 1.486.743.743 0 0 0 0-1.486z"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconListingAppointment'
})
