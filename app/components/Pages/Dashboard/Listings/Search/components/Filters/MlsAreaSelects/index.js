import React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { change as updateField } from 'redux-form'

import Label from '../components/Label'
import api from '../../../../../../../../models/listings/search'

const formName = 'filters'

const MlsAreaSelects = (
  {
    areas = [],
    subareas = [],
    selectedAreas,
    onChangeAreas,
    loadingSubareas,
    selectedSubareas,
    onChangeSubareas
  } // console.log(subareas)
) =>
  <div style={{ marginBottom: '3rem' }}>
    <Label label="MLS Areas">
      <Select
        multi
        name="mls_areas"
        options={areas}
        value={selectedAreas}
        placeholder="Area #..."
        onChange={onChangeAreas}
        disabled={loadingSubareas}
        className="c-filters__select"
      />
    </Label>
    {selectedAreas.length > 0 &&
      <Label label="MLS Subareas">
        <Select
          multi
          name="subareas"
          options={subareas}
          addLabelText="MLS Subareas"
          placeholder="Subarea #..."
          onChange={onChangeSubareas}
          value={selectedSubareas}
          disabled={loadingSubareas}
          className="c-filters__select"
          style={{ margninBottom: '2rem' }}
        />
      </Label>}
  </div>

export default compose(
  lifecycle({
    componentDidMount() {
      api.getMlsAreas().then(areas => {
        this.setState({
          areas
        })
      })
    }
  }),
  connect(null, { updateField }),
  withState('subareas', 'setSubareas', []),
  withState('selectedAreas', 'setSelectedAreas', []),
  withState('selectedSubareas', 'setSelectedSubareas', []),
  withState('loadingSubareas', 'setLoadingSubareas', false),
  withHandlers({
    updateAreas: ({ selectedAreas, selectedSubareas, updateField }) => () => {
      if (selectedAreas.length === 0) {
        updateField(formName, 'mls_areas', null)
        return
      }

      const allAreas = [...selectedAreas, ...selectedSubareas]
      const areasByParents = {}
      allAreas.forEach(({ value, parent }) => {
        if (
          parent !== 0 &&
          areasByParents['0'] &&
          areasByParents['0'].indexOf(parent) === 0
        ) {
          areasByParents['0'] = areasByParents['0'].filter(p => p !== parent)
        }

        areasByParents[parent] = !areasByParents[parent]
          ? [value]
          : [...areasByParents[parent], value]
      })

      const mls_areas = []
      Object.keys(areasByParents).forEach(parent =>
        areasByParents[parent].forEach(mlsNumber => {
          mls_areas.push([mlsNumber, Number(parent)])
        })
      )

      updateField(formName, 'mls_areas', mls_areas)
    }
  }),
  withHandlers({
    getSubareas: ({ setSubareas, setLoadingSubareas }) => areas => {
      setLoadingSubareas(true)

      api.getMlsSubareas(areas).then(subareas => {
        setSubareas(subareas)
        setLoadingSubareas(false)
      })
    }
  }),
  withHandlers({
    onChangeAreas: ({
      getSubareas,
      setSubareas,
      updateAreas,
      selectedAreas,
      setSelectedAreas,
      selectedSubareas,
      setSelectedSubareas
    }) => areas => {
      if (areas.length === 0) {
        setSelectedAreas([], updateAreas)

        if (selectedSubareas.length > 0) {
          setSelectedSubareas([])
          return
        }

        return
      }

      setSelectedAreas(areas, () => {
        getSubareas(areas)
        updateAreas()
      })
    },
    onChangeSubareas: ({
      updateAreas,
      selectedSubareas,
      setSelectedSubareas
    }) => areas => {
      setSelectedSubareas(areas, updateAreas)
    }
  })
)(MlsAreaSelects)
