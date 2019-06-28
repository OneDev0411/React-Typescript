import styled from 'styled-components'

export const FallbackContainer = styled.div`
  height: 100vh;
`

export const TemplatesContainer = styled.div`
  padding: 0 1.5rem;

  & .templates-title {
    margin: 1.5rem 0 1rem;
    font-weight: 500;
  }
`

export const TemplatesListContainer = styled.div`
  margin: 2rem 0;

  & .grid-item {
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 3px;
    box-shadow: 0px 2px 15px -5px rgba(0, 0, 0, 0.5);
    transition: 0.3s;
    min-height: 15.8rem;
    background: #eee;
    overflow: hidden;
    cursor: zoom-in;

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
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
      top: 0;
      left: 0;
      padding: 1rem;
      z-index: 2;
      opacity: 0;
      transform: translateY(0.5rem);
      transition: all 0.35s;

      .actionbar-delete {
        background: #000;

        & svg {
          fill: #fff;
        }

        &:hover {
          background: #fff;

          & svg {
            fill: #000;
          }
        }
      }

      & button:nth-child(2) {
        margin-left: 1rem;
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

  & .template_date {
    margin-top: 0.5rem;
    color: #7f7f7f;
    position: absolute;
    bottom: -2rem;
    opacity: 0;
    transform: translateY(0.5rem);
    transition: all 0.35s;
  }

  .grid-item:hover + .template_date {
    opacity: 1;
    transform: translateY(0);
  }

  .grid-item.loading + .template_date {
    opacity: 1;
    transform: translateY(0);
  }

  .templates-masonry-grid {
    display: flex;
    margin-left: -3rem; /* gutter size offset */
    width: auto;
  }
  .templates-masonry-grid_column {
    padding-left: 3rem; /* gutter size */
    background-clip: padding-box;
  }

  .templates-masonry-grid_column > div {
    margin-bottom: 4rem;
    position: relative;
  }
`
