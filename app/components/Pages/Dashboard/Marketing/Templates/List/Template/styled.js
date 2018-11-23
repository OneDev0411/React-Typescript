import styled from 'styled-components'

import { grey } from 'views/utils/colors'

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 3px;
  justify-content: center;
  background-color: ${grey.A100};
  border: 1px solid transparent;

  &:hover {
    border-color: ${grey.A300};

    .action-bar {
      opacity: 1;
      visibility: visible;
    }
  }

  &:last-child {
    margin-right: 0;
  }

  > img {
    width: 14rem;
  }

  .action-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
    visibility: hidden;
    padding: 1rem;
    background-color: #fff;
    will-change: opacity;
    transition: opacity 0.3s ease-in;
  }
`
