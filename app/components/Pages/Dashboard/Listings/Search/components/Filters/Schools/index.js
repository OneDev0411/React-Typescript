import React from 'react'
import Select from 'react-select'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Label from '../components/Label'
import api from '../../../../../../../../models/listings/search'

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
            <Label label={title}>
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
  withState('schools', 'setSchools', []),
  withState('selectedSchools', 'setSelectedSchools', []),
  withState('loadingSchools', 'setLoadingSchools', false),
  withState('selectedDistricts', 'setSelectedDistricts', []),
  withHandlers({
    getSchools: ({
      setSchools,
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
    }
  }),
  withHandlers({
    onChangeDistricts: ({
      getSchools,
      setSchools,
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

        if (Object.keys(selectedSchools).length > 0) {
          setSelectedSchools([])
        }
      } else {
        setSelectedDistricts(districts, () => {
          getSchools(districts)
        })
      }
    },
    onChangeSchools: ({
      setSelectedSchools,
      selectedSchools,
      loadingSchools
    }) => (type, schools) => {
      if (loadingSchools) {
        return
      }

      const nextState = {}
      schools.forEach(
        ({ value: name }) =>
          (nextState[type] = !selectedSchools[type]
            ? [name]
            : [...selectedSchools[type], name])
      )

      selectedSchools = {
        ...selectedSchools,
        ...nextState
      }

      setSelectedSchools(selectedSchools, () => {
        console.log(selectedSchools)
      })
    }
  })
)(Schools)
