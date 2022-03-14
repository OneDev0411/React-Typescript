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
  const sellerAgent: Optional<IShowingRole> = roles.find(
    user => user.role === 'SellerAgent'
  )
  const officeName = sellerAgent?.agent?.office?.name

  return (
    <Box display="flex" alignItems="center" ml={4}>
      <Typography noWrap variant="caption" color="textSecondary">
        Agent
      </Typography>
      <Typography noWrap variant="subtitle2" className={classes.agentName}>
        {`${sellerAgent?.first_name} ${sellerAgent?.last_name}`}
      </Typography>
      {officeName && (
        <Typography noWrap variant="subtitle2" color="textSecondary">
          {officeName}
        </Typography>
      )}
    </Box>
  )
}

export default ShowingDetailHeaderAgentInfo
