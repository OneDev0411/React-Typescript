import styled from 'styled-components'

export const MapContainer = styled.div`
  height: 10rem;

  @media (min-width: 64em) {
    margin-right: ${props => (props.hasCoverImage ? '0.5rem' : 0)};
    width: ${props => (props.hasCoverImage ? 'calc(70% - 0.5em)' : '100%')};
  }
`

export const Image = styled.div`
  display: none;

  @media (min-width: 64em) {
    display: block;
    height: 10rem;
    width: 14rem;
    background-image: ${props => `url('${props.image}')`};
    background-size: cover;
  }
`
