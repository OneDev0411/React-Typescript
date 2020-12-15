import styled from 'styled-components'

import { grey, borderColor } from '../../../../../../../views/utils/colors'
import Card from '../../../../../../../views/components/Card'

export const SearchContainer = styled.div`
  display: inline-block;
  position: relative;
`
export const ListContainer = styled(Card)`
  width: 133%;
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: 4;
`

export const ListTitle = styled.div`
  color: ${grey.A900};
  padding: 0.5rem 0.75rem;
  font-weight: 500;
`

export const Item = styled.div`
  cursor: default;
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
