import React from 'react'
import Flex from 'styled-flex-component'
import { mdiLightningBolt } from '@mdi/js'
import { makeStyles } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { Container } from './styled'

const useStyles = makeStyles(
  theme => ({
    icon: {
      marginBottom: theme.spacing(1),
      color: theme.palette.success.main
    }
  }),
  { name: 'ActiveMode' }
)

export default function ActiveMode() {
  const classes = useStyles()

  return (
    <Container center>
      <Flex center column>
        <SvgIcon
          path={mdiLightningBolt}
          size={muiIconSizes.large}
          className={classes.icon}
        />
        <div>This contact is already in this flow.</div>
      </Flex>
    </Container>
  )
}
