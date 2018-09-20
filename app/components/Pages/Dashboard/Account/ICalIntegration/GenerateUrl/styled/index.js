import styled from 'styled-components'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'
import LinkButton from '../../../../../../../views/components/Button/LinkButton'

export const GenerateUrlContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 1em;
  border-radius: 3px;
  background-color: #f0f4f7;
`

export const GenerateUrlText = styled.div`
  font-weight: 600;
  margin-left: 1em;
  white-space: nowrap;
`

export const FeedUrl = LinkButton.extend`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline !important;
  }
`
