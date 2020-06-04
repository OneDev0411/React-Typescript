import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { borderColor, brandBackground } from '../../utils/colors'

interface ContainerProps {
  size: number
  borderRadius: number
  backgroundColor?: string
  center: boolean
}

export const Container = styled(Flex)`
  position: relative;
  height: ${(props: ContainerProps) => props.size / 16}rem;
  width: ${(props: ContainerProps) => props.size / 16}rem;
  color: #fff;
  cursor: default;
  border-radius: ${(props: ContainerProps) => props.borderRadius}%;
  background-color: ${(props: ContainerProps) =>
    props.backgroundColor || '#000'};
`

export const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: inherit;

  &[alt] {
    font-size: 0;
  }
`

interface InitialsProps {
  size: number
}

export const Initials = styled.div`
  font-size: ${(props: InitialsProps) => (props.size * 0.4) / 16}rem;
  color: #fff;
`

interface StatusProps {
  size: number
  statusColor: string
  isOnline: boolean
}

export const Status = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${(props: StatusProps) => (props.size * 0.295454545) / 16}em;
  height: ${(props: StatusProps) => (props.size * 0.295454545) / 16}em;
  border-width: ${(props: StatusProps) => props.size * 0.0568181818}px;
  border-style: solid;
  border-color: ${brandBackground};
  border-radius: 100%;
  background-color: ${(props: StatusProps) =>
    props.isOnline ? props.statusColor : borderColor};
`
