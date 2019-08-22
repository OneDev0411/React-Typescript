import styled from 'styled-components'
import Flex from 'styled-flex-component'

import Card from 'components/Card'
import { grey, borderColor } from 'views/utils/colors'

export const Container = styled(Flex)`
  width: 60%;
  padding: 1em 1.5em;
`

export const StepsContainer = styled.div`
  height: 15.5em;
  width: 100%;
  overflow-y: auto;
  padding: 0.5em 1em;
  margin-bottom: 1em;
  border: solid 1px ${borderColor};
  background-color: ${grey.A125};
`

export const StepContainer = styled(Flex)`
  height: 1.5rem;
  font-size: 0.875rem;

  svg {
    width: 1rem;
    height: 1rem;
    fill: ${grey.A550};
    margin-right: 0.5rem;
  }
`

export const StartAtButton = styled.button`
  width: calc(100% - 2.5rem);
  padding: 0;
  margin-left: 1em;
  text-align: left;
  border: none;

  &:focus {
    outline: none;
  }
`
export const CalendarWrapper = styled(Card)`
  width: 90%;
  position: absolute;
  top: 50%;
  left: 55%;
  transform: translate(-55%, -50%);
  padding: 1em;
  z-index: 2;
  background: #fff;
`
