import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Form, Field } from 'react-final-form'
import moment from 'moment-timezone'
import {
  TextField,
  Button,
  Typography,
  Box,
  makeStyles
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { selectUserTimezone } from 'selectors/user'

import { addNotification as notify } from 'components/notification'
import { EDIT_USER_REQUEST, EDIT_USER_SUCCESS } from 'constants/user'

import FormCard from 'components/FormCard'
import { setUserTimezone } from 'models/user/set-user-timezone'

const useStyles = makeStyles(
  theme => ({
    input: {
      // TODO: remove this line after refactoring the form
      backgroundColor: '#f9f9f9',
      width: theme.spacing(45)
    }
  }),
  { name: 'AccountTimezonePicker' }
)

const timezones = moment.tz.names().map(item => ({ title: item, value: item }))

function Timezone() {
  const timezone = useSelector(selectUserTimezone)
  const dispatch = useDispatch()

  let submitError = null
  const classes = useStyles()

  const time_zone = timezone ? { title: timezone, value: timezone } : null

  const onSubmit = async ({ time_zone }) => {
    if (!time_zone || time_zone.value === timezone) {
      return
    }

    try {
      dispatch({
        type: EDIT_USER_REQUEST
      })

      const user = await setUserTimezone(time_zone.value)

      dispatch({
        user,
        type: EDIT_USER_SUCCESS
      })
      dispatch(
        notify({
          status: 'success',
          message: `Timezone updated to ${time_zone.value}.`
        })
      )
    } catch (error) {
      console.log(error)
      submitError = error && error.message
      throw error
    }
  }

  return (
    <FormCard title="Set Timezone">
      <Form
        // To fix Changing initialValues without changing form state
        // https://gitlab.com/rechat/web/-/issues/5231#note_624121151
        // https://github.com/final-form/react-final-form/issues/246
        // TODO: we have a major re-rendering issue related to redux-form here
        keepDirtyOnReinitialize
        onSubmit={onSubmit}
        initialValues={{ time_zone }}
        render={({ handleSubmit, submitFailed, submitting }) => (
          <form onSubmit={handleSubmit} className="c-account__form clearfix">
            <Field
              name="time_zone"
              render={({ input }) => (
                <Fragment>
                  <Box marginBottom={1} style={{ cursor: 'pointer' }}>
                    <Typography variant="body2">Timezones</Typography>
                  </Box>
                  <Autocomplete
                    value={input.value || null}
                    onChange={(event, newValue) => {
                      input.onChange(newValue)
                    }}
                    getOptionLabel={option =>
                      option.title ? option.title : ''
                    }
                    getOptionSelected={(option, selectedValue) => {
                      return option.value === selectedValue.value
                    }}
                    options={timezones}
                    disableClearable
                    data-test="timezone-dropdown"
                    disabled={submitting}
                    renderInput={params => (
                      <TextField
                        {...params}
                        placeholder="Select a timezone"
                        className={classes.input}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </Fragment>
              )}
            />
            {submitFailed && (
              <div className="c-auth__submit-error-alert">
                {submitError.message}
              </div>
            )}
            <div style={{ textAlign: 'right' }}>
              <Button
                color="secondary"
                variant="contained"
                type="submit"
                disabled={submitting}
                data-test="timezone-form-submit-button"
              >
                {submitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        )}
      />
    </FormCard>
  )
}

export default Timezone
