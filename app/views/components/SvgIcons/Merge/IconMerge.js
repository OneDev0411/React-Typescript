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
      d="M23 19.1355C23 20.6775 21.7168 22 20.2201 22c-1.2337 0-2.3572-.9355-2.6244-2.1488h-.9638c-2.0336 0-3.803-1.1551-4.764-2.8078-.9116 1.6527-2.6796 2.8078-4.7118 2.8078h-.8027c-.2685 1.2119-1.3412 2.1473-2.6258 2.1473C2.2309 21.9985 1 20.6761 1 19.134s1.231-2.8078 2.7276-2.8078c1.1786 0 2.1976.8249 2.572 1.9815h.855c2.2471 0 3.9614-1.8171 3.9614-4.1303v-8.259l-2.1396 2.092-1.0741-1.1027 3.4285-3.413L11.8142 3l.5356.55 3.4257 3.4682L14.649 8.121l-2.0336-2.1473v8.2037c0 2.3146 1.8245 4.1303 4.0164 4.1303h1.0161c.376-1.1566 1.3935-1.9815 2.5721-1.9815C21.7168 16.3276 23 17.5933 23 19.1355zm-1.5503 0c0-.6605-.5357-1.2672-1.2281-1.2672-.643 0-1.2338.6067-1.2338 1.2672 0 .7157.5907 1.2671 1.2338 1.2671.6924 0 1.228-.5514 1.228-1.2671zm-16.487 0c0-.6605-.5356-1.2672-1.2337-1.2672-.6953 0-1.231.6067-1.231 1.2672 0 .7157.5357 1.2671 1.231 1.2671.6981 0 1.2337-.5514 1.2337-1.2671z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconMerge'
})
