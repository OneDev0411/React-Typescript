import styled from 'styled-components'

import OriginalIconButton from 'components/Button/IconButton'

export const Container = styled.div`
  padding: 1.5rem;
`

export const IconButton = styled(OriginalIconButton).attrs({
  iconSize: 'XLarge',
  isFit: true,
  appearance: 'outline'
})`
  margin: 0 0.2rem;
  svg {
    padding: 0.3rem !important;
  }
`
