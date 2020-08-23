import styled from 'styled-components'

import { grey, borderColor, primary } from '../../utils/colors'

const Container = styled.div`
  width: 100%;
  display: flex;
  border-radius: 3px;
  border: solid 1px ${borderColor};

  &:hover {
    cursor: pointer;

    .subject {
      color: ${primary};
    }
  }

  .cover {
    width: 6em;
    height: 6em;
    background: ${grey.A100};
    border-right: solid 1px ${borderColor};

    &.img {
      background-size: cover;
      border-radius: 3px 0 0 3px;
    }

    &.icon {
      display: flex;
      justify-content: center;
      align-items: center;

      > svg {
        color: ${grey.A900};
      }
    }
  }

  .details {
    width: calc(100% - 6em);
    padding: 0.625em 1em;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .subject {
    display: flex;
  }

  .subject__text {
    max-width: calc(100% - 3rem);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 1.5rem;
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.33;
  }

  .subject__icon {
    fill: ${grey.A900};
  }

  .body {
    height: 3em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @supports (-webkit-line-clamp: 2) {
    .body {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: initial;
      text-overflow: initial;
    }
  }
`

export default Container
