import styled from 'styled-components'

import { primary, grey, borderColor } from '../../../../utils/colors'
import Card from '../../../Card'

export const ListContainer = styled(Card)`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 100%;
  z-index: 1;
`

export const Item = styled.div`
  cursor: default;
  padding: 0 0.5rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 2rem;
  border-top: 1px solid ${borderColor};
  font-size: 0.75rem;
  color: ${grey.A900};

  .item__query {
    font-size: 0.875rem;
    padding-right: 0.25rem;
    color: #000;

    .item__matched {
      font-weight: 600;
    }
  }
`

export const DefaultItem = styled.button`
  width: 100%;
  padding: 0 0.5rem;
  font-size: 1rem;
  line-height: 2;
  font-weight: 500;
  text-align: left;
  border: none;
  color: #000;
  background-color: #fdfdfd;
  cursor: default;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  > .search-text {
    color: ${primary};
  }
`
