import { Button, ButtonGroup, makeStyles, Typography } from '@material-ui/core'
import { mdiClockOutline } from '@mdi/js'
import { useField, useFormState } from 'react-final-form'

import { futureTimeValidator } from '@app/utils/validations/future-time'
import { DateTimePicker } from '@app/views/components/DateTimePicker'
import { formatDate } from '@app/views/components/DateTimePicker/helpers'
import LinkButton from '@app/views/components/LinkButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    root: { borderTop: `1px solid ${theme.palette.divider}` },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: theme.spacing(1.5, 3, 1, 3),
      '& > *': { marginLeft: theme.spacing(1) }
    },
    info: {
      background: theme.palette.info.ultralight,
      height: theme.spacing(6),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    date: { marginLeft: theme.spacing(0.5) },
    postBtn: { minWidth: theme.spacing(7) },
    datePickerBtn: {
      paddingLeft: 0,
      paddingRight: 0
    }
  }),
  { name: 'SocialDrawerSocialPostFormFooter' }
)

interface SocialDrawerSocialPostFormFooterProps {
  formId: string
}

function SocialDrawerSocialPostFormFooter({
  formId
}: SocialDrawerSocialPostFormFooterProps) {
  const classes = useStyles()

  const { submitting } = useFormState()
  const dueAtField = useField<Date>('dueAt')

  const hasScheduled = !!dueAtField.input.value
  const selectedDate = dueAtField.input.value || new Date()

  return (
    <div className={classes.root}>
      <div className={classes.actions}>
        <DateTimePicker
          onClose={dueAtField.input.onChange}
          showTimePicker
          selectedDate={selectedDate}
          defaultSelectedDate={selectedDate}
          datePickerModifiers={{
            disabled: {
              before: new Date()
            }
          }}
          validate={futureTimeValidator}
        >
          {({ handleOpen }) => (
            <>
              <ButtonGroup
                variant="contained"
                color="primary"
                aria-label="split button"
                size="small"
                disabled={submitting}
              >
                <Button className={classes.postBtn} type="submit" form={formId}>
                  {hasScheduled ? 'Save' : 'Post'}
                </Button>
                <Button
                  className={classes.datePickerBtn}
                  aria-label="select date and time"
                  onClick={handleOpen}
                >
                  <SvgIcon path={mdiClockOutline} size={muiIconSizes.medium} />
                </Button>
              </ButtonGroup>
            </>
          )}
        </DateTimePicker>
      </div>
      {hasScheduled && (
        <div className={classes.info}>
          <Typography variant="body2" component="span">
            Scheduled to send on
          </Typography>
          <Typography
            className={classes.date}
            variant="subtitle2"
            component="span"
          >
            {formatDate(selectedDate)}.
          </Typography>
          <LinkButton
            variant="text"
            color="primary"
            to="/dashboard/insights/social-post?filter=scheduled"
            target="_blank"
          >
            See Scheduled Items
          </LinkButton>
        </div>
      )}
    </div>
  )
}

export default SocialDrawerSocialPostFormFooter
