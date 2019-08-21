import styled from 'styled-components'

import { grey } from 'views/utils/colors'

export const FallbackContainer = styled.div`
  height: 100vh;
`

export const TemplatesContainer = styled.div`
  & .templates-title {
    font-weight: 500;
    margin: 1.5rem;
  }
`

export const TemplatesListContainer = styled.div`
  padding: 1.5rem;

  & .grid-item {
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 3px;
    box-shadow: 0px 2px 15px -5px rgba(0, 0, 0, 0.5);
    transition: 0.3s;
    min-height: 15.8rem;
    background: ${grey.A200};
    overflow: hidden;
    cursor: zoom-in;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2), 0px 3px 4px rgba(0, 0, 0, 0.12),
      0px 2px 0px rgba(0, 0, 0, 0.14);

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2);
      opacity: 0;
      z-index: 1;
      transition: all 0.5s;
      content: '';
    }

    & img {
      width: 100%;
    }

    & .action-bar {
      display: flex;
      justify-content: space-between;
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 0.5rem;
      z-index: 2;
      opacity: 0;
      transform: translateY(0.5rem);
      transition: all 0.35s;

      .action-bar__right {
        display: flex;
        justify-content: flex-end;
      }

      .action-bar__icon-button {
        padding: 0 0.5rem;
        background: rgba(0, 0, 0, 0.55);

        & svg {
          fill: #fff;
        }

        &:hover {
          background: #000;
        }
      }

      button {
        margin-right: 0.5rem;
      }

      button:last-child {
        margin-right: 0;
      }
    }

    &:not(.loading):hover {
      .action-bar {
        opacity: 1;
        transform: translateY(0);
      }

      &:after {
        opacity: 1;
      }
    }

    &.loading {
      &:after {
        background: rgba(255, 255, 255, 0.7);
        opacity: 1;
      }
    }

    &.loading {
      cursor: wait;
    }
  }

  & .template-date {
    margin-top: 0.5rem;
    position: absolute;
    bottom: -3rem;
    opacity: 0;
    transform: translateY(0.5rem);
    transition: all 0.35s;

    .caption {
      font-size: 0.75rem;
      letter-spacing: 1.5px;
      font-size: 600;
      color: ${grey.A900};
    }
  }

  .grid-item:hover + .template-date {
    opacity: 1;
    transform: translateY(0);
  }

  .grid-item.loading + .template-date {
    opacity: 1;
    transform: translateY(0);
  }

  .templates-masonry-grid {
    display: flex;
    margin-left: -2rem; /* gutter size offset */
    width: auto;
  }
  .templates-masonry-grid_column {
    padding-left: 2rem; /* gutter size */
    background-clip: padding-box;
  }

  .templates-masonry-grid_column > div {
    margin-bottom: 2rem;
    position: relative;
  }

  .templates-masonry-grid_column.is-instance > div {
    margin-bottom: 5rem;
  }
`
