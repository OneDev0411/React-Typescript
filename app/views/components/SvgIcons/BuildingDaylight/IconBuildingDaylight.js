import React from 'react'
import styled, { css } from 'styled-components'

const width = '96'
const height = '96'
const viewBox = '0 0 96 96'

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
    <g
      fill="none"
      fillRule="evenodd"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
      key="key-0"
    >
      <path d="M30 94h30a2 2 0 0 0 2-2V44a2 2 0 0 0-2-2H32a2 2 0 0 0-2 2v50z" />
      <path d="M38 42V20a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v72a2 2 0 0 0 2 2h26" />
      <path d="M10 94V84a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10m20 0V84a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10m8-44H50M38 34H26m12-8H18m44 32h-8" />
      <path
        fill="#F5A623"
        d="M79.665 16.343A8 8 0 1 1 68.35 27.657a8 8 0 0 1 11.314-11.314"
      />
      <path d="M74 2v4M59.88 7.84l2.8 2.84M54 22h4m1.88 14.12l2.8-2.8M74 42v-4m14.16-1.88l-2.84-2.8M94 22h-4M88.16 7.88l-2.84 2.8" />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconBuildingDaylight'
})
