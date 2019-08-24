import styled from 'styled-components'

import ALink from 'components/ALink'
import { primary, borderColor, grey } from 'views/utils/colors'

export const Tabs = styled.div`
  position: sticky;
  top: 0;
  z-index: 3;
  list-style: none;
  padding: 0 1.5rem;
  background-color: #fff;

  .tabs-inneer {
    width: 100%;
    display: flex;
    border-bottom: 1px solid ${borderColor};
  }
`

export const Tab = styled(ALink)`
  padding: 1.5rem 2rem;
  line-height: 1;
  font-weight: 600;
  color: ${props => (props.selected ? primary : grey.A900)};
  border-bottom: ${props => (props.selected ? `2px solid ${primary}` : 'none')};

  &:focus {
    outline: none;
  }
`
