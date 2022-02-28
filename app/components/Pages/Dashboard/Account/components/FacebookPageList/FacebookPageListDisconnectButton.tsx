import { Button, makeStyles } from '@material-ui/core'

import { useDisconnectFacebookPage } from '@app/models/facebook'

const useStyles = makeStyles(
  theme => ({
    disconnect: { color: theme.palette.error.main }
  }),
  { name: 'FacebookPageListDisconnectButton' }
)

interface FacebookPageListDisconnectButtonProps {
  facebookPage: IFacebookPage
}

function FacebookPageListDisconnectButton({
  facebookPage
}: FacebookPageListDisconnectButtonProps) {
  const classes = useStyles()
  const { mutate, isLoading: isDeleting } = useDisconnectFacebookPage()

  const handleDisconnect = () => mutate(facebookPage)

  return (
    <Button
      className={classes.disconnect}
      color="inherit"
      size="small"
      variant="outlined"
      onClick={handleDisconnect}
      disabled={isDeleting}
    >
      Disconnect
    </Button>
  )
}

export default FacebookPageListDisconnectButton
