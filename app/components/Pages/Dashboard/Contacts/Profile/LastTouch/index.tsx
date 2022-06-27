import { Box, makeStyles, Theme } from '@material-ui/core'

import { LastTouched } from 'components/LastTouched'

import { BasicSection } from '../components/Section/Basic'

const useStyles = makeStyles(
  (theme: Theme) => ({
    wrapper: {
      padding: theme.spacing(0, 1)
    },
    icon: {
      position: 'relative',
      top: theme.spacing(0.5),
      marginLeft: theme.spacing(1),
      color: theme.palette.grey[900]
    }
  }),
  { name: 'ContactProfileLastTouch' }
)

interface Props {
  contact: INormalizedContact
}

export const LastTouch = ({ contact }: Props) => {
  const classes = useStyles()

  return (
    <BasicSection title="Last Touch">
      <Box className={classes.wrapper}>
        <LastTouched contact={contact} />
      </Box>
    </BasicSection>
  )
}
