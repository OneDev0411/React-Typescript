import styled from 'styled-components'

export const Container = styled.div`
  padding: 0 1.5em;
`

export const ViewMode = styled.div`
  display: ${props => (props.enabled ? 'block' : 'none')};
  height: 100%;

  /* 
    having flex-grow with overflow doesn't work in Safari browsers properly
    https://codepen.io/mohsentaleb/pen/BaWyGXp
  */
  @media not all and (min-resolution: 0.001dpcm) {
    @media {
      height: calc(100vh - 190px);
    }
  }
`
