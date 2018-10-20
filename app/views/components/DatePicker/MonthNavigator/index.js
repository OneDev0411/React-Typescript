import React from 'react'
import { Container, Button } from './styled'
import Tooltip from '../../tooltip'
import IconKeyboardArrowLeft from '../../SvgIcons/KeyboardArrowLeft/IconKeyboardArrowLeft'
import IconKeyboardArrowRight from '../../SvgIcons/KeyboardArrowRight/IconKeyboardArrowRight'

const Navbar = ({ onPreviousClick, onNextClick }) => (
  <Container>
    <Tooltip caption="Previous Month" placement="left">
      <Button onClick={() => onPreviousClick()}>
        <IconKeyboardArrowLeft />
      </Button>
    </Tooltip>
    <Tooltip caption="Next Month" placement="left">
      <Button onClick={() => onNextClick()}>
        <IconKeyboardArrowRight />
      </Button>
    </Tooltip>
  </Container>
)

export default Navbar
