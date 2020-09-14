import React from 'react'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

import { SvgIcon } from '../../SvgIcons/SvgIcon'

import { Container, Button } from './styled'

const Navbar = ({ onPreviousClick, onNextClick }) => (
  <Container>
    <Button onClick={() => onPreviousClick()}>
      <SvgIcon path={mdiChevronLeft} />
    </Button>

    <Button onClick={() => onNextClick()}>
      <SvgIcon path={mdiChevronRight} />
    </Button>
  </Container>
)

export default Navbar
