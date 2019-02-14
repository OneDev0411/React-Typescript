import styled from 'styled-components'

import { primary, grey } from 'views/utils/colors'
import ActionButton from 'components/Button/ActionButton'

export const Container = styled.div`
  position: relative;
  margin: 0 1em 1em;
  padding: 0.5em;
  border-radius: 3px;
  border: 1px dashed transparent;

  &:hover {
    cursor: pointer;
    background: ${grey.A150};
    border-color: ${primary};

    > .action-bar {
      visibility: visible;
    }
  }
`

export const Label = styled.div`
  display: flex;
  align-items: center;
  color: ${grey.A900};
  margin-bottom: 0.25em;
`

export const Value = styled.div`
  min-height: 1.5rem;
`

export const ActionBar = styled.div`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  visibility: hidden;
  display: inline-flex;
`

export const EditButton = styled(ActionButton)`
  padding: 0;
  height: auto;
  line-height: 1;
`
