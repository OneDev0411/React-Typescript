import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  height: 13rem;
  margin-bottom: 1em;

  &:after {
    content: 'Calculating Direction ...';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${props => (props.isCalculating ? 1 : 0)};
    font-size: 1.5rem;
    font-weight: 500;
    color: #fff;
    background: rgba(0, 0, 0, 0.7);
    will-change: opacity;
    transition: opacity 0.3s ease-out;
    z-index: ${props => (props.isCalculating ? 1 : '-1')};
  }
`
