import React from 'react'
import styled, { css } from 'styled-components'

const width = '105'
const height = '121'
const viewBox = '0 0 105 121'

const getDimensions = () => ({
  height,
  width
})

const getDimensionsCss = () => css`
  width: ${width}px;
  height: ${height}px;
`

const Image = styled.svg`
  ${({ noStyles }) => (!noStyles ? getDimensionsCss() : null)}
`

const defaultProps = {
  children: [
    <defs key="key-0">
      <rect id="s-7fac62daa8-a" width="28" height="38" x="77" y="45" rx="3" />
      <mask id="s-7fac62daa8-b" width="28" height="38" x="0" y="0" fill="#fff">
        <use xlinkHref="#s-7fac62daa8-a" />
      </mask>
    </defs>,
    <g fill="none" fillRule="evenodd" key="key-1">
      <path stroke="#F2F2F2" strokeLinecap="square" d="M54 .5v119.309" />
      <rect width="28" height="38" y="45" fill="#E6E6E6" rx="3" />
      <use
        stroke="#CCC"
        strokeDasharray="2"
        strokeWidth="2"
        mask="url(#s-7fac62daa8-b)"
        xlinkHref="#s-7fac62daa8-a"
      />
      <rect
        width="27"
        height="37"
        x="40.5"
        y="19.5"
        fill="#FFF"
        stroke="#999"
        rx="3"
        transform="rotate(20 54 38)"
      />
      <path
        fill="#CCC"
        fillRule="nonzero"
        d="M72.779 70.02c-.225.322-.59 1.12.152.977a103.26 103.26 0 0 0 8.779-2.82l1.396-.52c.674.172 1.347.345 1.983.559.674.172 2.443-2.05 1.688-2.298-.279-.109-.596-.176-.874-.284.376-.485.63-1.083.337-1.583-.252-.463-.974-.909-1.378-1.209-.565-.452-1.09-.865-1.656-1.317a61.25 61.25 0 0 0-3.703-2.542c-2.65-1.636-5.442-2.874-8.384-3.87-.517-.18-1.642 1.353-1.322 1.499a55.402 55.402 0 0 1 7.656 4.407c1.167.784 2.295 1.609 3.348 2.515.325.303.647.527.972.83-15.07-4.109-31.335-4.17-46.502-.93a94.89 94.89 0 0 0-14.19 4.228c-.62.257-1.19.788-1.523 1.389-.148.24-.391 1.152.228.895 16.246-6.106 33.979-7.864 51.086-5.044 2.963.486 5.972 1.166 8.903 1.85-1.748.571-3.458 1.102-5.249 1.557-.739.223-1.377 1.07-1.747 1.711z"
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconSplitterDnD'
})
