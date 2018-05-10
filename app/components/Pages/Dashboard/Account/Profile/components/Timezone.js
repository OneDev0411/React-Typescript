import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { addNotification as notify } from 'reapop'
import moment from 'moment-timezone'

import FormCard from './FormCard'
import { getBrandInfo } from '../../../../Auth/SignIn'
import { Dropdown } from '../../../../../../views/components/Dropdown'
import { setUserTimezone } from '../../../../../../models/user/set-user-timezone'

const Timezone = ({ brand, timezone, notify }) => {
  let submitError = null
  const { brandColor } = getBrandInfo(brand)

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
      await setUserTimezone(time_zone.value)

      notify({
        status: 'success',
        message: `Timezone updated to ${time_zone.value}.`
      })
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
        render={({ handleSubmit, pristine, submitFailed, submitting }) => (
          <form onSubmit={handleSubmit} className="c-account__form clearfix">
            <Field
              name="time_zone"
              render={({ input }) => (
                <Fragment>
                  <label className="c-simple-field__label">Timezones</label>
                  <Dropdown
                    input={input}
                    items={timezones}
                    itemToString={handleItemToString}
                  />
                </Fragment>
              )}
            />
            {submitFailed && (
              <div className="c-auth__submit-error-alert">
                {submitError.message}
              </div>
            )}
            <button
              type="submit"
              className="c-auth__submit-btn"
              disabled={submitting || pristine}
              style={{
                background: brandColor,
                opacity: submitting || pristine ? 0.7 : 1
              }}
            >
              {submitting ? 'Updating...' : 'Update'}
            </button>
          </form>
        )}
      />
    </FormCard>
  )
}

export default connect(null, { notify })(Timezone)
