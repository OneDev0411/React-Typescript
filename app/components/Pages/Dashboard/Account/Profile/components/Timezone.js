import React, { Fragment } from 'react'
import { Form, Field } from 'react-final-form'
import moment from 'moment-timezone'

import FormCard from './FormCard'
import { getBrandInfo } from '../../../../Auth/SignIn'
import { Dropdown } from '../../../../../../views/components/Dropdown'
import { setUserTimezone } from '../../../../../../models/user/set-user-timezone'

const Timezone = ({ brand, timezone }) => {
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
    } catch (error) {
      console.log(error)
      submitError = error && error.message
      throw error
    }
  }

  return (
    <FormCard title="Set Timezone">
      <Form
        onSubmit={onSubmit}
        initialValues={{ time_zone }}
        render={({
          handleSubmit,
          pristine,
          submitFailed,
          submitting,
          submitSucceeded
        }) => (
          <form onSubmit={handleSubmit} className="c-account__form clearfix">
            <Field
              name="time_zone"
              render={({ input }) => (
                <Fragment>
                  <label className="c-simple-field__label">Timezones</label>
                  <Dropdown input={input} items={timezones} />
                </Fragment>
              )}
            />
            {submitFailed && (
              <div className="c-auth__submit-error-alert">
                {submitError.message}
              </div>
            )}
            {submitSucceeded && (
              <div style={{ textAlign: 'center' }}>
                <p className="c-auth__submit-alert--success">
                  Timezone updated.
                </p>
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

export default Timezone
