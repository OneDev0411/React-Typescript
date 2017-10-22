import React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { change as updateField, formValueSelector } from 'redux-form'

import Label from '../components/Label'
import api from '../../../../../../../../models/listings/search'

const FORM_NAME = 'filters'
const selector = formValueSelector(FORM_NAME)
export const SCHOOLS_TYPE = [
  'high_schools',
  'middle_schools',
  'primary_schools',
  'elementary_schools',
  'senior_high_schools',
  'junior_high_schools',
  'intermediate_schools'
]

const Schools = ({
  schools = {},
  districts = [],
  loadingSchools,
  selectedSchools,
  onChangeSchools,
  onChangeDistricts,
  selectedDistricts
}) => (
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
      loadingSchools && (
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
        </p>
      )}
    {Object.keys(schools).length > 0 && (
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
                name={school}
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
      </div>
    )}
  </div>
)

export default compose(
  connect(
    state => {
      const initialSchools = {}
      const initialDistricts = selector(state, 'school_districts') || []

      SCHOOLS_TYPE.forEach(school => {
        const schoolData = selector(state, school) || []
        if (schoolData.length > 0) {
          initialSchools[school] = schoolData
        }
      })

      return {
        initialSchools,
        initialDistricts
      }
    },
    { updateField }
  ),
  withState('schools', 'setSchools', []),
  withState(
    'selectedSchools',
    'setSelectedSchools',
    ({ initialSchools }) => initialSchools
  ),
  withState('loadingSchools', 'setLoadingSchools', false),
  withState(
    'selectedDistricts',
    'setSelectedDistricts',
    ({ initialDistricts }) => initialDistricts
  ),
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
          type = `${type}s`
          schoolsByTypes[type] = !schoolsByTypes[type]
            ? [name]
            : [...schoolsByTypes[type], name]
        })

        setSchools(schoolsByTypes)
      })
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
        setSelectedSchools([])
        setSelectedDistricts([])
        updateField(FORM_NAME, 'school_districts', [])

        if (Object.keys(selectedSchools).length > 0) {
          Object.keys(selectedSchools).forEach(school =>
            updateField(FORM_NAME, school, [])
          )
          setSelectedSchools([])
        }
      } else {
        setSelectedDistricts(districts, () => {
          updateField(FORM_NAME, 'school_districts', districts)
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

      selectedSchools[type] = schools.length === 0 ? [] : schools

      setSelectedSchools(selectedSchools, () => {
        Object.keys(selectedSchools).forEach(school =>
          updateField(FORM_NAME, school, selectedSchools[school])
        )
      })
    }
  }),
  lifecycle({
    componentDidMount() {
      const { selectedDistricts, getSchools } = this.props
      if (selectedDistricts.length > 0) {
        getSchools(selectedDistricts)
      }
    }
  })
)(Schools)
