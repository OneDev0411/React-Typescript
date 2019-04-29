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
      d="M23.429.5a1.512 1.512 0 0 0-1.661-.155L1.069 11.48a2.023 2.023 0 0 0 .161 3.642l3.244 1.391 2.244 6.023c.35.94 1.763 2.1 3.509.517l3.123-2.736 2.769 1.183a2.025 2.025 0 0 0 2.746-1.314l5.076-18.102A1.513 1.513 0 0 0 23.429.5zM6.478 16.165L12.9 12l-4.3 4.853c-.12.144-.202.316-.238.5l-.432 2.709-1.452-3.897zm3.371 4.56l.287-1.785 1.176.5-1.463 1.285zm7.135-1.334a.249.249 0 0 1-.339.162l-5.309-2.275a.25.25 0 0 1-.089-.395l8-9.056a1.01 1.01 0 0 0-.143-1.444 1.069 1.069 0 0 0-1.15-.057l-12.79 8.3-2.68-1.178A.25.25 0 0 1 2.467 13L21.7 2.652l-4.716 16.739z"
      key="IconMarketingInsights"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconMarketingInsights'
})
