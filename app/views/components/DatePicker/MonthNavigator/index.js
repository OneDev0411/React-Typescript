import React from 'react'

import IconKeyboardArrowLeft from '../../SvgIcons/KeyboardArrowLeft/IconKeyboardArrowLeft'
import IconKeyboardArrowRight from '../../SvgIcons/KeyboardArrowRight/IconKeyboardArrowRight'

import { Container, Button } from './styled'

const Navbar = ({ onPreviousClick, onNextClick }) => (
  <Container>
    <Button onClick={() => onPreviousClick()}>
      <IconKeyboardArrowLeft />
    </Button>

    <Button onClick={() => onNextClick()}>
      <IconKeyboardArrowRight />
    </Button>
  </Container>
)

export default Navbar
