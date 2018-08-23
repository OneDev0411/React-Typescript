import styled from 'styled-components'

export const ColumnsContainer = styled.div`
  padding: 1em;

  /* 768px */
  @media (min-width: 48em) {
    display: flex;
  }
`

export const SideColumnWrapper = styled.div`
  overflow: hidden;

  @media (min-width: 48em) {
    width: 30%;
    display: flex;
    flex-direction: column;
  }

  /* 1280px */
  @media (min-width: 80em) {
    width: 25%;
    display: block;
  }
`

export const SecondColumn = styled.div`
  @media (min-width: 48em) {
    width: calc(70% - 1em);
    margin-left: 1em;
  }

  @media (min-width: 80em) {
    margin: 0 1em;
    width: calc(50% - 2em);
  }
`

export const ThirdColumn = styled.div`
  @media (min-width: 80em) {
    width: 25%;
  }
`
