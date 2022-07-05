import { Typography, Theme, makeStyles } from '@material-ui/core'

import { fromNow, getMonthName, getDayNumber } from '@app/utils/date-utils'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center'
    },
    normalDate: {
      marginLeft: theme.spacing(0.5),
      color: theme.palette.grey[700]
    }
  }),
  { name: 'BirthdayCell' }
)

function getBirthday(birthday: string): {
  humanizedDate: string
  normalDate: string
} {
  const now = new Date()
  const birthdayDate = new Date(birthday)

  birthdayDate.setFullYear(
    now.getUTCFullYear(),
    birthdayDate.getUTCMonth(),
    birthdayDate.getUTCDate()
  )
  birthdayDate.setHours(0, 0, 0, 0)

  return {
    humanizedDate: fromNow(birthdayDate),
    normalDate: `(${getMonthName(birthdayDate)} ${getDayNumber(birthdayDate)})`
  }
}

interface Props {
  contact: IContact
}

export function BirthdayCell({ contact }: Props) {
  const classes = useStyles()

  if (!contact.birthday) {
    return null
  }

  const birthday = getBirthday(contact.birthday)

  return (
    <div className={classes.container}>
      <Typography variant="inherit">{birthday.humanizedDate}</Typography>
      <Typography variant="caption" className={classes.normalDate}>
        {birthday.normalDate}
      </Typography>
    </div>
  )
}
