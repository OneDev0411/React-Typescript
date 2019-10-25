import styled from 'styled-components'

export const GifLayout = styled.div`
  .gifs {
    display: flex;
    flex-wrap: wrap;
  }
`

export const Gif = styled.div`
  padding: 1rem;
  transition: all 0.5s;

  & img {
    width: 100%;
  }

  &:hover {
    background: #eee;
    cursor: pointer;
  }
`
