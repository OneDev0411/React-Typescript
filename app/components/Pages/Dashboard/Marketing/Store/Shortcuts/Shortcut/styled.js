import { Link } from 'react-router'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { grey, primary } from 'views/utils/colors'

export const Title = styled.div`
  text-align: center;
  color: ${grey.A550};

  .c-shortcut--active > & {
    font-weight: 500;
    color: #000;
  }
`

export const Placeholder = styled(Flex)`
  position: relative;
  width: 10.25rem;
  height: 8.25rem;
  margin-bottom: 0.5rem;
  border-radius: 3px;
  background-color: ${grey.A100};

  .c-shortcut--active:hover > & {
    background-color: ${grey.A300};
  }
`

export const Container = styled.div`
  position: relative;
  margin-right: 1rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-right: 0;
  }

  &.c-shortcut--active:hover ${Title} {
    color: ${primary};
  }

  &:not(.c-shortcut--active):hover {
    ${Placeholder}:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 3px;
      background-color: rgba(0, 0, 0, 0.15);
    }

    ${Placeholder}:after {
      content: 'Coming soon!';
      width: 100%;
      position: absolute;
      bottom: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      font-weight: 500;
      letter-spacing: 1px;
      color: #fff;
    }
  }
`

export const Anchor = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`
