import styled from 'styled-components'

import { primary, grey, borderColor } from 'views/utils/colors'

export const Container = styled.div`
  position: relative;
  margin: 0 1em 1em;
  padding: 0.5em;
  background: ${grey.A150};
  border-radius: 3px 3px 0 0;
  border: 1px dashed ${primary};
`

export const ActionBar = styled.div`
  position: absolute;
  top: calc(100% + 1px);
  left: 0;
  width: 100%;
  height: 3em;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: ${props =>
    props.showDelete ? 'space-between' : 'flex-end'};
  padding: 0 0.5em;
  background: ${grey.A100};
  border-radius: 0 0 3px 3px;
  border: 1px solid ${borderColor};
`
