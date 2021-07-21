import React from 'react'

import { makeStyles } from '@material-ui/core'
import { mdiLightningBolt } from '@mdi/js'
import Flex from 'styled-flex-component'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { grey } from 'views/utils/colors'

import { Container } from './styled'

const useStyles = makeStyles(
  theme => ({
    icon: {
      marginBottom: theme.spacing(1)
    }
  }),
  { name: 'FlowFormDefaultView' }
)

export default function DefaultView() {
  const classes = useStyles()

  return (
    <Container center>
      <Flex center column>
        <SvgIcon
          path={mdiLightningBolt}
          color={grey.A900}
          size={muiIconSizes.large}
          className={classes.icon}
        />
        <div>Select a Flow from the left list.</div>
      </Flex>
    </Container>
  )
}
