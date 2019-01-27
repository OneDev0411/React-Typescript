import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const NotifyOfficeContainer = styled.div`
  opacity: ${props => (props.display ? 1 : 0)};
`

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d4d4d4;
  padding: 0.875rem 0;
  
  /* :hover ${NotifyOfficeContainer} {
    opacity: 1;
  } */
`

export const Title = styled.div`
  font-size: 1rem;
  flex: 0.9;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  ${props =>
    props.isSelected &&
    `
    font-weight: 500;
    color: ${primary};
  `}

  :hover {
    color: ${primary};
    text-decoration: underline;
    cursor: pointer;
  }
`
