import styled from 'styled-components'
import Flex from 'styled-flex-component'

export const Container = styled.div`
  padding: 0 1.5em;
`

export const SearchWrapper = styled(Flex)`
  @media screen and (max-width: 1200px) {
    flex-wrap: wrap;
    > div {
      overflow: auto;
    }
  }
`
