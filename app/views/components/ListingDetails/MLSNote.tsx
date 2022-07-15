import { Grid, makeStyles, Theme, Typography } from '@material-ui/core'
import fecha from 'fecha'
import nunjucks from 'nunjucks'
import { useSelector } from 'react-redux'

import { useUnsafeActiveBrand } from '@app/hooks/brand'
import { IAppState } from '@app/reducers'

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
  mlsName: string
  disclaimer: string
  logo: Nullable<string>
}

export default function MLSNote({ disclaimer, mlsName, logo }: Props) {
  const classes = useStyles()
  const activeBrand = useUnsafeActiveBrand()
  const hostBrand = useSelector<IAppState, IBrand>(
    (state: IAppState) => state.brand
  )

  const lastUpdateDate = getLastUpdateDate()
  const brokerage = {
    name: hostBrand?.name || activeBrand?.name || mlsName,
    logo
  }

  const renderedDisclaimer = nunjucks.renderString(disclaimer, { brokerage })

  return (
    <div className={classes.container}>
      {logo && (
        <Grid item className={classes.imageWrapper}>
          <img className={classes.logo} src={logo} alt={mlsName} />
        </Grid>
      )}
      <Grid item className={classes.noteWrapper}>
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: renderedDisclaimer }}
        />
        <Typography variant="body1" className={classes.closedNote}>
          Some properties which appear for sale on this website may no longer be
          available because they are under contract, have Closed or are no
          longer being offered for sale.
          <br />
          {`Copyright © ${mlsName} ${lastUpdateDate.getFullYear()}. All rights reserved. Last updated at ${fecha.format(
            lastUpdateDate,
            'MMM DD, YYYY hh:mm A'
          )}.`}
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
