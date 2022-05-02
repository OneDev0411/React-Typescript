import styled from 'styled-components'

import Card from '../../../../../../../views/components/Card'
import { grey, borderColor } from '../../../../../../../views/utils/colors'

export const SearchContainer = styled.div`
  position: relative;
`

// TODO: refactor this styled-component and use MUI theme
export const ListContainer = styled(Card)`
  width: 100%;
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: ${props => props.theme.zIndex.modal - 1};
`

export const ListTitle = styled.div`
  color: ${grey.A900};
  padding: 0.5rem 0.75rem;
  font-weight: 500;
`

export const Item = styled.div`
  cursor: pointer;
  padding: 0 0.75rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 2rem;
  border-bottom: 1px solid ${borderColor};
  font-size: 0.75rem;
  color: ${grey.A900};

  &:hover {
    background: ${grey.A000};
  }

  .item__query {
    font-size: 0.875rem;
    padding-right: 0.25rem;
    color: #000;

    .item__matched {
      font-weight: 600;
    }
  }
`
export const NoResults = styled.div`
  padding: 8px;
  text-align: center;
`
