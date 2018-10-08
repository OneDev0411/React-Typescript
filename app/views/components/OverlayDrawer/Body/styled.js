import styled from 'styled-components'

const heightWithFooter = 'calc(100vh - 72px)'
const heightWithoutFooter = '100vh'

export const Container = styled.div`
  overflow: auto;
  padding: 58px 1.5rem 0;

  min-height: ${props =>
    props.showFooter ? heightWithFooter : heightWithoutFooter};
  max-height: ${props =>
    props.showFooter ? heightWithFooter : heightWithoutFooter};
`
