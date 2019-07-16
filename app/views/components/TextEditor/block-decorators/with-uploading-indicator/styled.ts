import styled from 'styled-components'

import IconCircleSpinner from '../../../SvgIcons/CircleSpinner/IconCircleSpinner'

export const LoadingWrapper = styled.span<{ uploading?: boolean }>`
  img {
    opacity: ${({ uploading }) => (uploading ? '.3' : '1')};
  }
  position: relative;
  ${IconCircleSpinner} {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
`
