import styled from 'styled-components'

import ActionButton from 'components/Button/ActionButton'
import { primary } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  align-items: center;

  position: absolute;
  bottom: 0;
  left: 0;
  right: 25%;

  background-color: #fff;
  padding: 0 2rem;
  height: 65px;
  border-top: 1px solid #dadada;
  z-index: 1;
`

export const Divider = styled.div`
  height: 30px;
  width: 1px;
  border-right: 1px solid #dadada;
  margin: 0 1rem;
`

export const FrameButton = styled(ActionButton)`
  margin-right: 0.5rem;

  &.is-active,
  :hover {
    background-color: ${primary};
    color: #fff !important;
  }
`
