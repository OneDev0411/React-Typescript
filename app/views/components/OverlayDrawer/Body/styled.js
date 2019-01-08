import styled from 'styled-components'

const heightWithFooter = 'calc(100vh - 4.5rem)'
const heightWithoutFooter = '100vh'

export const Container = styled.div`
  overflow: auto;
  padding: 4.5rem 1.5rem 0;

  min-height: ${props =>
    props.showFooter ? heightWithFooter : heightWithoutFooter};
  max-height: ${props =>
    props.showFooter ? heightWithFooter : heightWithoutFooter};
`
