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
      d="M18.335 8.706l-2.581-.043c.18-1.15.299-3.14-.72-4.44C14.594 3.666 13.751 3 12.223 3c-.396 0-.827.044-1.282.132a.724.724 0 0 0-.587.819c.597 3.799-.85 4.659-1.143 4.791a1.67 1.67 0 0 0-.896.36 1.7 1.7 0 0 0-.828-.215H5.683C4.755 8.887 4 9.625 4 10.533v6.821C4 18.262 4.755 19 5.683 19h1.805a1.7 1.7 0 0 0 .944-.284c.262.18.576.284.914.284h8.026c.91 0 1.653-.723 1.682-1.619l.94-6.9a.833.833 0 0 0 .006-.103 1.68 1.68 0 0 0-1.665-1.672zM7.693 17.354a.203.203 0 0 1-.205.201H5.683a.203.203 0 0 1-.205-.2v-6.823c0-.11.092-.2.205-.2h1.805c.113 0 .206.09.206.2v6.822zm9.891-.119a.717.717 0 0 0-.006.096c0 .117-.098.224-.206.224H9.346c-.088 0-.175-.123-.175-.248V10.38c0-.114.082-.2.19-.2a.752.752 0 0 0 .18-.022c.123-.03 2.887-.769 2.37-5.702.916-.067 1.555.144 1.949.645.85 1.082.493 3.321.284 4.092a.71.71 0 0 0 .123.62.744.744 0 0 0 .574.29l3.477.077c.1 0 .187.082.202.182l-.936 6.872z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconSocial'
})
