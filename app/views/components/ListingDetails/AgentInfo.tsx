import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    name: {
      marginBottom: theme.spacing(1)
    },
    photo: {
      maxWidth: '100%'
    },
    photoPlacehlder: {
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(1),
      backgroundColor: theme.palette.grey['100']
    },
    list: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    },
    listItem: {
      marginBottom: theme.spacing(1),
      wordBreak: 'break-all'
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

function AgentInfo({ name, jobTitle, email, company, tel, image }: Props) {
  const classes = useStyles()
  const items = [jobTitle, email, company, tel].filter(Boolean)

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        {image ? (
          <img alt={name} src={image} className={classes.photo} />
        ) : (
          <div className={classes.photoPlacehlder}>
            <Typography variant="caption" color="textSecondary">
              The agent's photo is not available!
            </Typography>
          </div>
        )}
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle1" component="h3" className={classes.name}>
          {name}
        </Typography>
        <ul className={classes.list}>
          {items.map((item, index) => (
            <Typography
              className={classes.listItem}
              key={index}
              variant="caption"
              component="li"
            >
              {item}
            </Typography>
          ))}
        </ul>
      </Grid>
    </Grid>
  )
}

export default AgentInfo
