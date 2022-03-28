import { Paper, PaperProps, Divider, makeStyles } from '@material-ui/core'

import LinkButton from '@app/views/components/LinkButton'

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      height: theme.spacing(7),
      display: 'flex',
      alignItems: 'center'
    },
    button: {
      justifyContent: 'left',
      // TODO: Remove the below styles when the bootstrap CSS is removed
      '&:hover': { color: theme.palette.primary.main },
      '&:focus': { outline: 0 }
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

  return (
    <Paper {...paperProps}>
      {children}
      <Divider />
      <div
        className={classes.wrapper}
        onClick={event => {
          event.preventDefault()
          event.stopPropagation()
        }}
      >
        <LinkButton
          className={classes.button}
          to="/dashboard/account/connected-accounts"
          target="_blank"
          color="primary"
          fullWidth
          size="large"
        >
          Manage Instagram Account...
        </LinkButton>
      </div>
    </Paper>
  )
}

export default InstagramAccountPaperWithManageAccountLink
