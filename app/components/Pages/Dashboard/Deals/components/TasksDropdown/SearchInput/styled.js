import styled from 'styled-components'

import { primary } from 'views/utils/colors'
import ActionButton from 'components/Button/ActionButton'

export const SearchContainer = styled(ActionButton)`
  &:hover > svg {
    fill: ${primary};
  }
  line-height: normal;
  height: auto;
  min-height: 2.5rem;
`

export const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`

export const SubTitle = styled.div`
  color: gray;
  text-align: left;
  font-size: 0.875rem;
  margin: 0.25rem 0;
`

export const Input = styled.input`
  width: 95%;
  border: none;
  cursor: pointer;
  background-color: transparent;
  text-overflow: ellipsis;

  :focus {
    outline: none;
  }
`

export const Title = styled.div`
  width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props => (props.hasTask ? '#000' : 'gray')};
`
