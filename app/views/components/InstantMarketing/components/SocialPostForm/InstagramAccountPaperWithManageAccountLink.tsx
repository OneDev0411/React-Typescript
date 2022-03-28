import { MouseEvent } from 'react'

import {
  Paper,
  PaperProps,
  Divider,
  Button,
  makeStyles
} from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      height: theme.spacing(7),
      display: 'flex',
      alignItems: 'center'
    },
    button: {
      justifyContent: 'left'
    }
  }),
  { name: 'InstagramAccountPaperWithManageAccountLink' }
)

type InstagramAccountPaperWithManageAccountLinkProps = PaperProps

function InstagramAccountPaperWithManageAccountLink({
  children,
  ...paperProps
}: InstagramAccountPaperWithManageAccountLinkProps) {
  const classes = useStyles()

  const stopEvent = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleClick = (event: MouseEvent) => {
    stopEvent(event)

    window.open('/dashboard/account/connected-accounts', '_blank')
  }

  return (
    <Paper {...paperProps}>
      {children}
      <Divider />
      <div className={classes.wrapper}>
        <Button
          className={classes.button}
          color="primary"
          fullWidth
          size="large"
          onClick={handleClick}
          onMouseDown={stopEvent}
        >
          Manage Instagram Account...
        </Button>
      </div>
    </Paper>
  )
}

export default InstagramAccountPaperWithManageAccountLink
