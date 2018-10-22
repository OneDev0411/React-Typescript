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
      d="M13.83 7.883C13.83 5.742 12.14 4 10.066 4 7.993 4 6.305 5.742 6.305 7.883c0 2.182 1.678 4.818 3.762 4.818s3.762-2.636 3.762-4.818zm-5.835 0c0-1.18.93-2.14 2.073-2.14 1.143 0 2.072.96 2.072 2.14 0 1.286-1.044 3.074-2.072 3.074-1.029 0-2.073-1.788-2.073-3.074zM3.05 18.831c1.073-3.037 3.892-5.076 7.017-5.076 3.123 0 5.944 2.039 7.016 5.076a.897.897 0 0 1-.102.799.838.838 0 0 1-.692.37H3.845a.838.838 0 0 1-.692-.37.895.895 0 0 1-.102-.8zm7.017-3.333c-1.99 0-3.82 1.071-4.868 2.759h9.735c-1.049-1.689-2.878-2.759-4.867-2.759zm7.551-4.134c.933 0 1.69-.782 1.691-1.743V7.386c0-.481.377-.872.845-.872.467 0 .845.39.845.872v2.235c0 1.922-1.514 3.487-3.38 3.487h-1.026l.78.804a.89.89 0 0 1 0 1.232.83.83 0 0 1-1.195 0l-2.222-2.292a.89.89 0 0 1 0-1.232l2.222-2.294a.827.827 0 0 1 1.194 0c.33.34.33.893 0 1.233l-.78.805h1.026z"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconTaskFollowUp'
})
