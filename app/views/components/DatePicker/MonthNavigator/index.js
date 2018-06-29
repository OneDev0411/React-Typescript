import React from 'react'
import { Container, Button } from './styled'

const Navbar = ({ onPreviousClick, onNextClick }) => (
  <Container>
    <Button
      data-balloon="Previous Month"
      data-balloon-pos="left"
      onClick={() => onPreviousClick()}
    >
      <i className="fa fa-angle-left" />
    </Button>

    <Button
      data-balloon="Next Month"
      data-balloon-pos="left"
      onClick={() => onNextClick()}
    >
      <i className="fa fa-angle-right" />
    </Button>
  </Container>
)

export default Navbar
