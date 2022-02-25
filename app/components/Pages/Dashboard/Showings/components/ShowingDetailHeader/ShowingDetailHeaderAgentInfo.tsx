import { Box, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    agentName: { margin: theme.spacing(0, 1) }
  }),
  { name: 'ShowingDetailHeaderAgentInfo' }
)

interface ShowingDetailHeaderAgentInfoProps {
  roles: IShowingRole[]
}

function ShowingDetailHeaderAgentInfo({
  roles
}: ShowingDetailHeaderAgentInfoProps) {
  const classes = useStyles()
  const sellerAgent = roles.find(user => user.role === 'SellerAgent')

  return (
    <Box display="flex" alignItems="center" ml={4}>
      <Typography noWrap variant="caption" color="textSecondary">
        Agent
      </Typography>
      <Typography noWrap variant="subtitle2" className={classes.agentName}>
        {`${sellerAgent?.first_name} ${sellerAgent?.last_name}`}
      </Typography>
      {sellerAgent?.office_name && (
        <Typography noWrap variant="subtitle2" color="textSecondary">
          {sellerAgent?.office_name}
        </Typography>
      )}
    </Box>
  )
}

export default ShowingDetailHeaderAgentInfo
