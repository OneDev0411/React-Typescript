import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    text: {
      marginBottom: theme.spacing(2)
    }
  }),
  { name: 'AgentInfo' }
)

interface Props {
  name: string
  jobTitle?: string
  email?: string
  company?: string
  tel?: string
  image?: string | null
}

const CLAY = 'https://s3.amazonaws.com/rechat-user-avatars/15557751.jpg'

function AgentInfo({ name, jobTitle, email, company, tel, image }: Props) {
  const classes = useStyles()

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <img alt="logo" src={image || CLAY} style={{ maxWidth: '100%' }} />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5">{name}</Typography>
        <Typography className={classes.text}>{jobTitle}</Typography>
        <Typography className={classes.text}>{email}</Typography>
        <Typography className={classes.text}>{company}</Typography>
        <Typography className={classes.text}>{tel}</Typography>
      </Grid>
    </Grid>
  )
}

export default AgentInfo
