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
    transform: translate3d(0, 0, 0);
    transition: 0.3s;
    min-height: 15.8rem;
    background: #eee;
    overflow: hidden;

    & img {
      width: 100%;
    }

    & .action-bar {
      display: flex;
      justify-content: space-between;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      visibility: hidden;
      padding: 1rem;
      background-color: rgba(255, 255, 255, 0.95);
    }

    &:hover {
      box-shadow: 0 22px 43px rgba(0, 0, 0, 0.15);
      transform: translateY(-4px);

      .action-bar {
        visibility: visible;
      }
      .template_date {
        display: block;
      }
    }
  }

  & .template_date {
    margin-top: 0.5rem;
    display: none;
    color: #7f7f7f;
    position: absolute;
    bottom: -2rem;
  }

  .grid-item:hover + .template_date {
    display: block;
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
