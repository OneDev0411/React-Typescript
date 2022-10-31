import { Box, makeStyles, Theme } from '@material-ui/core'

import { LastTouched } from '@app/views/components/LastTouched'

import { BasicSection } from '../components/Section/Basic'

interface Props {
  contact: INormalizedContact
  submitCallback: (
    newContact: INormalizedContact,
    updatedAttribute: IContactAttributeDef
  ) => void
}

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

export const LastTouch = ({ contact, submitCallback }: Props) => {
  const classes = useStyles()

  return (
    // <BasicSection title="Last Touch">
    //   <Field title="Last Touch" value={lastTouchTime} />
    //   <Field
    //     title="Touch Frequency"
    //     value={`Every ${contact.touch_freq} ${
    //       contact.touch_freq === 1 ? 'day' : 'days'
    //     }`}
    //     isAction
    //   />
    // </BasicSection>
    <BasicSection title="Last Touch">
      <Box className={classes.wrapper}>
        <LastTouched contact={contact} />
      </Box>
    </BasicSection>
  )
}
