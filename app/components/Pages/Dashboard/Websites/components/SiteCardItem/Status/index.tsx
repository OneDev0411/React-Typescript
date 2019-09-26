import React, { useState } from 'react'

import { Switch } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { Container } from './styled'

interface StylesProps {
  isOnline: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: (props: StylesProps) => ({
      color: props.isOnline ? '#219653' : theme.palette.action.disabled,
      ...theme.typography.subtitle2
    })
  })
)

export function SiteStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const classes = useStyles({ isOnline })

  const handleToggle = () => setIsOnline(!isOnline)

  return (
    <Container>
      <div className={classes.label}>{isOnline ? 'Online' : 'Offline'}</div>

      <Switch
        checked={isOnline}
        onChange={handleToggle}
        value={isOnline}
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
    </Container>
  )
}
