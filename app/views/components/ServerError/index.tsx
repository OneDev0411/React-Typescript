import * as React from 'react'
import {
  Button,
  createStyles,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'

import request, { ResponseError } from 'superagent'

import { ReactNode } from 'react'
import { mdiAlertOutline } from '@mdi/js'

import { ClassesProps } from 'utils/ts-utils'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

type ErrorResponse = ResponseError & { response?: request.Response }

interface Props {
  error?: ErrorResponse | string
  /**
   * Whether to show retry button or not. By default the retry button is
   * shown only when {@link Props#onRetry} is passed AND server error status
   * is 5xx with this rationale that retry doesn't make sense for 4xx errors
   * but may make sense for 5xx errors.
   * If true/false value is passed, it will override this default behavior
   */
  showRetry?: boolean | 'default'
  onRetry?: () => void
  /**
   * Will be rendered bellow the message
   */
  children?: ReactNode
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flex: 1, // in case it's rendered in flex parent
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(2, 1)
    },
    errorMessage: {
      margin: theme.spacing(2, 0)
    }
  })

const useStyles = makeStyles(styles, { name: 'ServerError' })

export function ServerError({
  showRetry = 'default',
  error,
  children = null,
  ...props
}: Props & ClassesProps<typeof styles>) {
  const classes = useStyles(props)

  let errorMessage = 'Something went wrong'

  if (typeof error === 'object' && error) {
    if (error.response && error.response.body && error.response.body.message) {
      errorMessage = error.response.body.message
    } else {
      errorMessage = error.message
    }
  } else if (typeof error === 'string') {
    errorMessage = 'error'
  }

  const retryButtonVisible =
    showRetry === 'default'
      ? error &&
        typeof error === 'object' &&
        error.response &&
        `${error.response.status}`[0] === '5'
      : showRetry

  return (
    <div className={classes.root}>
      <SvgIcon path={mdiAlertOutline} size={muiIconSizes.xlarge} />
      <Typography variant="h6" className={classes.errorMessage}>
        {errorMessage}
      </Typography>
      {retryButtonVisible && (
        <Button variant="outlined" onClick={props.onRetry}>
          Retry
        </Button>
      )}
      {children}
    </div>
  )
}
