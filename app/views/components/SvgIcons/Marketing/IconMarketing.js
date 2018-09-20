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
      d="M19.958 24H4.042C2.916 24 2 23.054 2 21.892V10a1 1 0 0 1 2 0v11.892l.046.109L19.958 22l.042-.108V10a1 1 0 1 1 2 0v11.892C22 23.054 21.084 24 19.958 24zm1.393-13a2.723 2.723 0 0 1-1.929-.793 1.692 1.692 0 0 0-2.377 0c-1.032 1.024-2.826 1.023-3.856 0a1.693 1.693 0 0 0-2.377 0c-1.029 1.022-2.825 1.024-3.857 0a1.691 1.691 0 0 0-2.376 0c-.927.92-2.483 1.039-3.54.271C.125 9.812-.236 8.555.16 7.419l1.963-5.993A2.11 2.11 0 0 1 4.117 0h16.158c.895 0 1.693.565 1.988 1.407l1.591 6.054c.374 1.125.011 2.359-.893 3.016a2.722 2.722 0 0 1-1.61.523zm-3.118-3.279c.941 0 1.881.355 2.597 1.065.279.277.781.201.955.073.229-.167.258-.519.166-.781l-.022-.076-1.577-6.012-.078.01H4.117l-.1.067L2.054 8.06c-.111.318-.039.654.162.8.173.127.675.204.953-.073a3.697 3.697 0 0 1 5.194 0 .757.757 0 0 0 1.039 0 3.698 3.698 0 0 1 5.194 0 .758.758 0 0 0 1.04 0 3.683 3.683 0 0 1 2.597-1.066zM15.029 24h-6a1 1 0 0 1-1-1v-7.495A2.508 2.508 0 0 1 10.534 13h2.99a2.508 2.508 0 0 1 2.505 2.505V23a1 1 0 0 1-1 1zm-5-2h4v-6.495a.506.506 0 0 0-.505-.505h-2.99a.506.506 0 0 0-.505.505V22zM6.163 6.9a1 1 0 0 1-.949-1.317l.733-2.2a1.001 1.001 0 0 1 1.898.634l-.733 2.2c-.14.418-.53.683-.949.683zm5.866 0a1 1 0 0 1-1-1V3.7a1 1 0 0 1 2 0v2.2a1 1 0 0 1-1 1zm5.867 0a.999.999 0 0 1-.948-.684l-.733-2.2a1 1 0 1 1 1.897-.633l.733 2.2a1 1 0 0 1-.949 1.317z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconMarketing'
})
