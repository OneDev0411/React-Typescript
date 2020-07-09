import styled from 'styled-components'

import ArrowLeftIcon from 'components/SvgIcons/ArrowLeft/ArrowLeftIcon'
import ArrowRightIcon from 'components/SvgIcons/ArrowRight/ArrowRightIcon'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 8rem 0 3rem;
`

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.8);
  cursor: pointer;
`

export const NextIcon = ArrowRightIcon

export const PreviousIcon = ArrowLeftIcon

export const Image = styled.img`
  height: 100%;
  width: auto;
  max-height: 100%;
  max-width: calc(100% - 3rem);
  user-select: none;
`
