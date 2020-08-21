import styled from 'styled-components'

import { grey } from '../../../../../../../views/utils/colors'

export const GenerateUrlContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 1em;
  border-radius: 3px;
  background-color: ${grey.A100};
`

export const GenerateUrlText = styled.div`
  font-weight: 600;
  margin-left: 1em;
  white-space: nowrap;
`

export const FeedUrl = styled.a`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline !important;
  }
`
