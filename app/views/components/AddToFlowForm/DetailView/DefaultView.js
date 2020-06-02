import React from 'react'
import Flex from 'styled-flex-component'

import { mdiLightningBolt } from '@mdi/js'

import { grey } from 'views/utils/colors'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { Container } from './styled'

export default function DefaultView() {
  return (
    <Container center>
      <Flex center column>
        <SvgIcon
          path={mdiLightningBolt}
          color={grey.A900}
          size={muiIconSizes.large}
          style={{ marginBottom: '1em' }}
        />
        <div>Select a Flow from the left list.</div>
      </Flex>
    </Container>
  )
}
