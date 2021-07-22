import React from 'react'

import { makeStyles } from '@material-ui/core'
import { mdiLightningBolt } from '@mdi/js'
import Flex from 'styled-flex-component'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
