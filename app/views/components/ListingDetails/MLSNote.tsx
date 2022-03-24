import { Grid, makeStyles, Theme, Typography } from '@material-ui/core'
import fecha from 'fecha'

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'center',
    color: theme.palette.tertiary.light,
    [theme.breakpoints.up('md')]: {
      alignItems: 'flex-start',
      flexDirection: 'row'
    }
  },
  imageWrapper: {
    width: 56, // From figma design
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2)
    }
  },
  noteWrapper: {
    flex: 1,
    [theme.breakpoints.up('md')]: {}
  },
  title: { marginBottom: theme.spacing(2) },
  logo: {
    maxWidth: '100%'
  },
  closedNote: { marginTop: theme.spacing(2) }
}))

interface Props {
  mls?: string
  mlsName?: string
  disclaimer?: string
  logo?: string
}

export default function MLSNote({ disclaimer, mls, mlsName, logo }: Props) {
  const classes = useStyles()

  if (!mlsName && !mls) {
    return null
  }

  const lastUpdateDate = getLastUpdateDate()

  const defaultDisclaimer = (
    <>
      <div>
        {mlsName && (
          <Typography variant="body1">{`Listing information provided in part by the ${mlsName}, for personal,
            non-commercial use by viewers of this site and may not be reproduced or redistributed.
            All information is deemed reliable but not guaranteed.`}</Typography>
        )}
        {mls && (
          <Typography variant="body1">
            {` Copyright © ${mls} ${lastUpdateDate.getFullYear()}. All rights reserved. Last updated at ${fecha.format(
              lastUpdateDate,
              'MMM DD, YYYY hh:mm A'
            )}.`}
          </Typography>
        )}
      </div>

      {mlsName && (
        <Typography variant="body1">
          {`The data relating to real estate for sale on this website appears in part through the ${mlsName} Internet Data Exchange program,
         a voluntary cooperative exchange of property listing data between licensed real estate brokerage firms in which participates,
          and is provided by ${mlsName} through a licensing agreement.`}
        </Typography>
      )}
    </>
  )

  return (
    <div className={classes.container}>
      {logo && (
        <Grid item className={classes.imageWrapper}>
          <img className={classes.logo} src={logo} alt={mlsName} />
        </Grid>
      )}
      <Grid item className={classes.noteWrapper}>
        <Typography variant="body1" className={classes.title}>
          RLS Data display by {mlsName}
        </Typography>
        {disclaimer ? (
          <Typography variant="body1">{disclaimer}</Typography>
        ) : (
          defaultDisclaimer
        )}

        <Typography variant="body1" className={classes.closedNote}>
          Some properties which appear for sale on this website may no longer be
          available because they are under contract, have Closed or are no
          longer being offered for sale.
        </Typography>
      </Grid>
    </div>
  )
}

// Rounds the timestamp to the nearest 15 minute.
// For example we show 7:15 if it's 7:19, and 7:45 if it's 7:58
function getLastUpdateDate() {
  const date = new Date()
  const minutes = date.getMinutes()

  date.setMinutes(minutes - (minutes % 15))

  return date
}
