import React, { useState, useCallback } from 'react'
import { Box, Typography, Tooltip, makeStyles, Theme } from '@material-ui/core'
import { mdiStopCircleOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
      color: theme.palette.text.primary,
      borderRadius: theme.shape.borderRadius,
      opacity: (props: { disabled: boolean }) => (props.disabled ? 0.5 : 1),
      pointerEvents: (props: { disabled: boolean }) =>
        props.disabled ? 'none' : 'initial',
      '&:hover': {
        background: theme.palette.action.hover
      }
    },
    status: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: theme.palette.success.main,
      marginLeft: theme.spacing(1)
    },
    stopFlow: {
      display: 'flex',
      cursor: 'pointer',
      '&:hover svg': {
        color: theme.palette.error.main
      }
    }
  }),
  {
    name: 'ContactProfileFlow'
  }
)

interface Props {
  flow: TBrandFlow<'steps'>
  onStop: (flowId: UUID) => Promise<void>
}

export default function Item({ flow, onStop }: Props) {
  const [disabled, setDisabled] = useState(false)
  const classes = useStyles({ disabled })

  const handleOnStop = useCallback(async () => {
    setDisabled(true)
    await onStop(flow.id)
    setDisabled(false)
  }, [flow.id, onStop])

  return (
    <Box className={classes.container}>
      <Box display="flex" alignItems="center">
        <Typography variant="body2">{flow.name}</Typography>
        <Box className={classes.status} />
      </Box>
      <Tooltip title="Stop this Flow">
        <Box className={classes.stopFlow} onClick={handleOnStop}>
          <SvgIcon path={mdiStopCircleOutline} size={muiIconSizes.small} />
        </Box>
      </Tooltip>
    </Box>
  )
}
