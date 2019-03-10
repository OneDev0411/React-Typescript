import styled from 'styled-components'

import { grey } from 'views/utils/colors'
import Arrow from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

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
  background-color: ${grey.A600};
  cursor: pointer;
`

export const NextIcon = styled(Arrow)`
  margin: 0 0 0 0.2rem;
  fill: #ffffff;
  transform: rotate(270deg);
  width: 2rem;
  height: 2rem;
`

export const PreviousIcon = styled(NextIcon)`
  margin: 0 0.2rem 0 0;
  transform: rotate(90deg);
`

export const Image = styled.img`
  height: 100%;
  width: auto;
  max-height: 100%;
  max-width: calc(100% - 3rem);
`
