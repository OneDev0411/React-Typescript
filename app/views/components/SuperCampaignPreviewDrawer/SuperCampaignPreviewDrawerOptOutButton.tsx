import { List, ListItem, makeStyles, Typography } from '@material-ui/core'

import SplitButton from '../SplitButton'

const useStyles = makeStyles(
  theme => ({
    root: {
      color: theme.palette.error.main,
      whiteSpace: 'nowrap'
    }
  }),
  { name: 'SuperCampaignPreviewDrawerOptOutButton' }
)

interface SuperCampaignPreviewDrawerOptOutButtonProps {
  onOptOut: () => void
  onOptOutAndCopy: () => void
  disabled?: boolean
}

function SuperCampaignPreviewDrawerOptOutButton({
  onOptOut,
  onOptOutAndCopy,
  ...otherProps
}: SuperCampaignPreviewDrawerOptOutButtonProps) {
  const classes = useStyles()

  return (
    <>
      <SplitButton
        {...otherProps}
        className={classes.root}
        color="inherit"
        variant="outlined"
        onClick={onOptOut}
        size="small"
        RenderMenu={({ closeMenu }) => (
          <List dense onClick={closeMenu}>
            <ListItem button onClick={onOptOutAndCopy}>
              <Typography variant="body2">
                Opt-Out and Copy this campaign
              </Typography>
            </ListItem>
          </List>
        )}
      >
        Opt-Out
      </SplitButton>
    </>
  )
}

export default SuperCampaignPreviewDrawerOptOutButton
