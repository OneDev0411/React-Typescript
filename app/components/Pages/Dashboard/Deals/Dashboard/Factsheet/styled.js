import styled from 'styled-components'

import { H3, H4 } from 'components/Typography/headings'
import LinkButton from 'components/Button/LinkButton'
import IconButton from 'components/Button/IconButton'

export const Container = styled.div`
  padding: 1.5rem 0; /* 24px */
`

export const SectionTitle = styled(H3)`
  padding: 0 1.5rem;
`

export const ItemsContainer = styled.div`
  margin-top: 1.5rem;
`

export const ItemLabel = styled(H4)`
  color: #7f7f7f;
  font-weight: normal;
`

export const ItemValue = styled(H4)`
  font-weight: normal;
`

export const ItemActions = styled.div`
  display: flex;
  display: none;
`

export const Editable = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

export const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1px 0.5rem;
  padding: 0.5rem 1rem;
  border: dashed 1px ${props => (props.isEditing ? '#0c45e1' : 'transparent')};

  :hover {
    border-radius: 3px;
    border: dashed 1px #0c45e1;
    cursor: pointer;
    transition: 0.2s ease-in border;
  }

  :hover ${ItemValue} {
    display: none;
  }

  :hover ${ItemActions} {
    display: inherit;
  }
`

export const ActionButton = styled(LinkButton)`
  display: flex;
  align-items: center;
  height: auto;
  padding: 0;
  margin: 0;
  line-height: 1;
`

export const DeleteButton = styled(IconButton)`
  padding: 0;
  margin: 0 0 0 1rem;
  height: auto;
  line-height: 1;
`
