import React from 'react'
import Select from 'react-select'
import { change as updateField } from 'redux-form'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Label from '../components/Label'
import api from '../../../../../../../../models/listings/search'

const formName = 'filters'

const Schools = ({
  schools = {},
  districts = [],
  loadingSchools,
  selectedSchools,
  onChangeSchools,
  onChangeDistricts,
  selectedDistricts
}) =>
  <div style={{ marginBottom: '3rem' }}>
    <Label label="School District">
      <Select.Async
        multi
        name="school_districts"
        value={selectedDistricts}
        disabled={loadingSchools}
        onChange={onChangeDistricts}
        className="c-filters__select"
        placeholder="School district name..."
        loadOptions={api.getSchoolsDistricts}
      />
    </Label>
    {Object.keys(schools).length === 0 &&
      loadingSchools &&
      <p
        style={{
          padding: '1rem',
          color: '#fff',
          lineHeight: '1',
          fontSize: '1.7rem',
          backgroundColor: '#2196f3'
        }}
      >
        Loading Schools ...
      </p>}
    {Object.keys(schools).length > 0 &&
      <div>
        {Object.keys(schools).map(school => {
          const title = school
            .split('_')
            .map(s => s.charAt(0).toUpperCase() + s.substr(1))
            .join(' ')

          return (
            <Label label={title} key={school}>
              <Select
                multi
                name={`${school}s`}
                disabled={loadingSchools}
                value={selectedSchools[school]}
                onChange={schools => onChangeSchools(school, schools)}
                options={schools[school].map(s => ({ label: s, value: s }))}
                className="c-filters__select"
                placeholder={`${title} Schools name...`}
              />
            </Label>
          )
        })}
      </div>}
  </div>

export default compose(
  connect(null, { updateField }),
  withState('schools', 'setSchools', []),
  withState('selectedSchools', 'setSelectedSchools', []),
  withState('loadingSchools', 'setLoadingSchools', false),
  withState('selectedDistricts', 'setSelectedDistricts', []),
  withHandlers({
    getSchools: ({
      setSchools,
      updateField,
      loadingSchools,
      setLoadingSchools
    }) => districts => {
      setLoadingSchools(true)

      api.getSchools(districts).then(schools => {
        const schoolsByTypes = {}

        setLoadingSchools(false)

        schools.forEach(({ type, name }) => {
          schoolsByTypes[type] = !schoolsByTypes[type]
            ? [name]
            : [...schoolsByTypes[type], name]
        })

        setSchools(schoolsByTypes)
      })

      updateField(
        formName,
        'school_districts',
        districts.map(({ value }) => value)
      )
    }
  }),
  withHandlers({
    onChangeDistricts: ({
      getSchools,
      setSchools,
      updateField,
      loadingSchools,
      selectedSchools,
      setSelectedSchools,
      setSelectedDistricts
    }) => (districts = []) => {
      if (loadingSchools) {
        return
      }

      if (districts.length === 0) {
        setSchools([])
        setSelectedDistricts([])
        updateField(formName, 'school_districts', null)

        if (Object.keys(selectedSchools).length > 0) {
          Object.keys(selectedSchools).forEach(school =>
            updateField(formName, `${school}s`, null)
          )
          setSelectedSchools([])
        }
      } else {
        setSelectedDistricts(districts, () => {
          getSchools(districts)
        })
      }
    },
    onChangeSchools: ({
      updateField,
      loadingSchools,
      selectedSchools,
      setSelectedSchools
    }) => (type, schools) => {
      if (loadingSchools) {
        return
      }

      selectedSchools[type] =
        schools.length === 0 ? [] : schools.map(({ value }) => value)

      setSelectedSchools(selectedSchools, () => {
        Object.keys(selectedSchools).forEach(school =>
          updateField(formName, `${school}s`, selectedSchools[school])
        )
      })
    }
  })
)(Schools)
