import React from 'react'
import Flex from 'styled-flex-component'
import { mdiLightningBolt } from '@mdi/js'
import { Box } from '@material-ui/core'

import { grey, primary } from 'views/utils/colors'

import ALink from 'components/ALink'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { Container } from './styled'

export default function WithoutStep({ flowId }) {
  return (
    <Container center>
      <Flex center column>
        <Box mb={1}>
          <SvgIcon
            path={mdiLightningBolt}
            color={grey.A900}
            size={muiIconSizes.large}
          />
        </Box>
        <div>This Flow has no steps yet!</div>
        <div>
          You can add some{' '}
          <ALink
            style={{ color: primary, fontWeight: 'bold' }}
            to={`/dashboard/marketing/flows/${flowId}`}
          >
            here
          </ALink>
          .
        </div>
      </Flex>
    </Container>
  )
}
