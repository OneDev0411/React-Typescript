import { EDIT_USER_REQUEST, EDIT_USER_SUCCESS } from 'constants/user'

import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { addNotification as notify } from 'components/notification'
import moment from 'moment-timezone'
import { Button, Typography, Box } from '@material-ui/core'

import FormCard from 'components/FormCard'
import { Dropdown } from 'components/Dropdown'
import { setUserTimezone } from 'models/user/set-user-timezone'

const Timezone = ({ timezone, dispatch }) => {
  let submitError = null

  const timezones = moment.tz
    .names()
    .map(item => ({ title: item, value: item }))

  const time_zone = timezone
    ? { title: timezone, value: timezone }
    : { title: 'Select a timezone', value: null }

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

  const handleItemToString = item => (item == null ? '' : String(item.title))

  return (
    <FormCard title="Set Timezone">
      <Form
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
                  <Dropdown
                    input={input}
                    hasSearch
                    noBorder={false}
                    items={timezones}
                    itemToString={handleItemToString}
                    data-test="timezone-dropdown"
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

export default connect()(Timezone)
