import styled from 'styled-components'

export const PageNumber = styled.div`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: rgba(0, 0, 0, 0.8);
  text-decoration: underline;
  text-align: center;
`

export const Container = styled.div`
  position: relative;

  canvas {
    display: block;
    margin: 0 auto;
    width: 85%;
    border: solid 1px #e6e6e6;
    ${props =>
      props.isLoading &&
      `
      filter: blur(2px);
    `};
  }

  .sk-circle {
    margin: 0 !important;
    padding: 0 !important;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
  }

  font-weight: 500;
  margin: 1rem;
`
