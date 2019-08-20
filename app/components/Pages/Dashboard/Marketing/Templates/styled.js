import styled from 'styled-components'

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

export const Tab = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
  border-bottom: ${props => (props.selected ? `2px solid ${primary}` : 'none')};

  > a {
    color: ${props => (props.selected ? primary : grey.A900)};
  }
`
