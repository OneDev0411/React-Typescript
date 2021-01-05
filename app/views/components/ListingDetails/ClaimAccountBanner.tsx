import React, { useState } from 'react'
import { Link as RouterLink, withRouter, WithRouterProps } from 'react-router'
import { Link, Snackbar, Theme, makeStyles } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'

const useStyles = makeStyles((theme: Theme) => {
  return {
    snackbar: {
      width: '640px',
      maxWidth: '100%',
      paddingRight: theme.spacing(2)
    }
  }
})

function ClaimAccountBanner(props: WithRouterProps) {
  const [isOpen, setIsOpen] = useState(true)
  const classes = useStyles({})
  const { query, search } = props.location
  const href = `/register${search}`

  if (!query.token) {
    return null
  }

  return (
    <Snackbar
      open={isOpen}
      className={classes.snackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity="info" onClose={() => setIsOpen(false)}>
        <AlertTitle>Claim Account</AlertTitle>
        <div>
          <span>This listing was shared to </span>
          <span>"{query.phone_number || query.email}".</span>{' '}
          <span>
            Claim your account to save this listing and check out many more.
          </span>{' '}
        </div>
        <div>
          <Link color="secondary" to={href} component={RouterLink}>
            Activate Your Account
          </Link>
        </div>
      </Alert>
    </Snackbar>
  )
}

export default withRouter(ClaimAccountBanner)
