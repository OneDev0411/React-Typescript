import styled from 'styled-components'
import Flex from 'styled-flex-component'

// import { grey } from 'views/utils/colors'

export const Container = styled(Flex)`
  width: 50%;
  padding: 1em 1.5em;
`

export const StepsContainer = styled.div`
  height: 16em;
  width: 100%;
  overflow-y: 'auto';
  padding: 0.5em 1em;
  border: solid 1px #e6e6e6;
  background-color: #f7f7f7;
`

export const StepContainer = styled(Flex)`
  height: 1.5rem;
  font-size: 0.875rem;
`
