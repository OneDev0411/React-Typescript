import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { grey } from 'views/utils/colors'
import ALinkToClosable from 'components/ALinkToClosable'

export const Container = styled.div`
  display: table;
  position: relative;
  align-self: center;
`

export const Name = styled.div`
  width: calc(100% - 40px - 1.5rem);
  margin-left: 1rem;
`

export const SubAddress = styled.div`
  color: ${grey.A550};
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`

export const Dot = styled.span`
  margin: 0 0.5rem;
  color: #000000;
`

export const IconContainer = styled(Flex)`
  width: 40px;
  height: 40px;
  background-color: #000;
  border-radius: 50%;
  > svg {
    height: 16px;
    width: 16px;
  }
`

export const Link = styled(ALinkToClosable)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  font-weight: 500;
  margin-top: -4px;
`
