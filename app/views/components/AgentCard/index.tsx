import {
  Grid,
  Card,
  CardContent,
  Typography,
  makeStyles
} from '@material-ui/core'

import Link from 'components/ALink'
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
    <Card variant="outlined" className={classes.card}>
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
                  <Link noStyle href={`mailto:${agent.email}`}>
                    {agent.email}
                  </Link>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  <Link noStyle href={`tel:${agent.phone_number}`}>
                    {agent.phone_number}
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
