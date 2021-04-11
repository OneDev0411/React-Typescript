import cn from 'classnames'
import {
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Typography,
  makeStyles,
  Theme
} from '@material-ui/core'

import { getWeekdayName, getDayNumber, getMonthName } from 'utils/date-utils'

const useStyles = makeStyles(
  (theme: Theme) => ({
    card: {
      width: theme.spacing(11),
      height: theme.spacing(11),
      margin: theme.spacing(0.5, 0),
      border: `1px solid ${theme.palette.divider}`,
      cursor: 'pointer'
    },
    cardActive: {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
    },
    cardDisabled: {
      backgroundColor: theme.palette.action.hover,
      border: 'none',
      cursor: 'not-allowed'
    },
    cardContent: {
      height: '100%',
      padding: '0 !important' // Because MUI adds some padding to the :last-child
    },
    cardContentContainer: {
      height: '100%'
    },
    cardActionArea: {
      height: '100%',
      padding: theme.spacing(1, 0)
    },
    weekday: {
      ...theme.typography.caption
    },
    dateNumber: {
      ...theme.typography.body1
    },
    monthName: {
      ...theme.typography.caption
    }
  }),
  {
    name: 'DateSlotPickerCard'
  }
)

interface Props {
  date: Date
  isActive?: boolean
  disabled?: boolean
  onClick: () => void
}

export default function DayCard({
  date,
  isActive = false,
  disabled = false,
  onClick
}: Props) {
  const classes = useStyles()

  return (
    <Card
      className={cn(classes.card, {
        [classes.cardActive]: isActive
      })}
    >
      <CardContent className={classes.cardContent}>
        <CardActionArea
          className={cn(classes.cardActionArea, {
            [classes.cardDisabled]: disabled
          })}
          onClick={disabled ? undefined : onClick}
        >
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="space-between"
            className={classes.cardContentContainer}
          >
            <Grid item>
              <Typography className={classes.weekday}>
                {getWeekdayName(date)}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.dateNumber}>
                {getDayNumber(date)}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.monthName}>
                {getMonthName(date)}
              </Typography>
            </Grid>
          </Grid>
        </CardActionArea>
      </CardContent>
    </Card>
  )
}
