import styled from 'styled-components'

import IconButton from 'components/Button/IconButton'

export const TruncatedColumn = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 1em;
`

export const OptionButton = styled(IconButton)`
  svg {
    fill: #000000;
  }
`
