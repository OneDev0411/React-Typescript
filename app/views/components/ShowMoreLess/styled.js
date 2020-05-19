import styled from 'styled-components'

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

export const ShowMoreLessText = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.palette.primary.main};
  font-weight: 400;
  cursor: pointer;
  width: 100%;
`

export const ArrowDown = styled(KeyboardArrowDownIcon)`
  margin-top: 0.2rem;
`

export const ArrowUp = styled(ArrowDown)`
  transform: rotate(180deg);
  margin-top: 0;
`
