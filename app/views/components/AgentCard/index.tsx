import {
  Grid,
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
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            {/* TODO: Remove the following line complaining about `contact` is required */}
            {/* @ts-ignore */}
            <Avatar
              alt={agent.full_name}
              size="xlarge"
              url={agent.profile_image_url ?? undefined}
            >
              {getNameInitials(agent.full_name)}
            </Avatar>
          </Grid>
          <Grid item>
            <Grid container item direction="column" justify="center">
              <Grid
                container
                item
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="subtitle1">{agent.full_name}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    {agent.office?.name}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  {agent.email}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  {agent.phone_number}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
