import React, { EventHandler, ReactNode } from 'react'
import {
  Box,
  createStyles,
  Divider,
  IconButton,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'

import { mdiClose } from '@mdi/js'

import { ClassesProps } from 'utils/ts-utils'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  children: ReactNode
  onClose: EventHandler<React.MouseEvent>
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1, 3)
    },
    title: {
      overflow: 'hidden',
      flex: 1
    }
  })

const useStyles = makeStyles(styles, { name: 'DialogTitle' })

export function DialogTitle({
  children,
  onClose,
  ...props
}: Props & ClassesProps<typeof styles>) {
  const classes = useStyles(props)

  return (
    <>
      <div className={classes.container}>
        <Box className={classes.title}>
          <Typography variant="h6" noWrap>
            {children}
          </Typography>
        </Box>
        {onClose && (
          <IconButton size="small" onClick={onClose}>
            <SvgIcon path={mdiClose} />
          </IconButton>
        )}
      </div>
      <Divider />
    </>
  )
}
