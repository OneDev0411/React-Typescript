import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  makeStyles
} from '@material-ui/core'

import { Avatar } from 'components/Avatar'

import { getNameInitials } from 'utils/helpers'

const useStyles = makeStyles(
  () => ({
    card: {
      width: '100%'
    }
  }),
  {
    name: 'AgentCard'
  }
)

interface Props {
  agent: IAgent
}

export default function AgentCard({ agent }: Props) {
  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <CardContent>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <Box py={1} px={2}>
              {/* TODO: Remove the following line complaining about `contact` is required */}
              {/* @ts-ignore */}
              <Avatar
                alt={agent.full_name}
                size="xlarge"
                url={agent.profile_image_url ?? undefined}
              >
                {getNameInitials(agent.full_name)}
              </Avatar>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} md={9}>
            <Grid container item direction="column" justify="center">
              <Grid item>
                <Typography variant="subtitle1">{agent.full_name}</Typography>
                <Typography variant="body2">{agent.office?.name}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2">{agent.email}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2">{agent.phone_number}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
