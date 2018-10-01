import styled from 'styled-components'

const heightWithFooter = 'calc(100vh - (59px + 72px))'
const heightWithoutFooter = 'calc(100vh - 59px)'

export const Container = styled.div`
  overflow: auto;

  min-height: ${props =>
    props.showFooter ? heightWithFooter : heightWithoutFooter};
  max-height: ${props =>
    props.showFooter ? heightWithFooter : heightWithoutFooter};
`
