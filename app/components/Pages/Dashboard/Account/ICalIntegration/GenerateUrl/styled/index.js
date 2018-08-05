import styled from 'styled-components'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'

export const GenerateUrlContainer = styled.div`
  display: flex;
  border-radius: 3px;
  background-color: #f0f4f7;
  padding: 1.4rem;
  align-items: center;
  position: relative;
`

export const GenerateUrlText = styled.div`
  font-weight: 600;
  color: #17283a;
  margin-left: 1.6rem;
  white-space: nowrap;
`
export const GenerateUrlButton = ActionButton.extend`
  margin-left: 3.6rem;
`
export const FeedUrl = styled.a`
  color: #2196f3;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 1rem;
  padding-right: 2rem;
  white-space: nowrap;
`
