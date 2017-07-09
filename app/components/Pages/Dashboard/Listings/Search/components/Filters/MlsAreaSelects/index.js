import React from 'react'
import Select from 'react-select'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import api from '../../../../../../../../models/listings/search'

const MlsAreaSelects = (
  {
    areas = [],
    subareas = [],
    selectedAreas,
    onChangeAreas,
    selectedSubareas,
    onChangeSubareas
  } // console.log(subareas)
) => (
  <div style={{ margninBottom: '3rem' }}>
    <label className="c-filters-label">MLS Areas</label>
    <Select
      multi
      name="mls_areas"
      options={areas}
      value={selectedAreas}
      placeholder="Area #..."
      onChange={onChangeAreas}
      className="c-filters__select"
    />
    {subareas.length > 0 &&
      <div>
        <label className="c-filters-label">MLS Subareas</label>
        <Select
          multi
          name="subareas"
          options={subareas}
          addLabelText="MLS Subareas"
          placeholder="Subarea #..."
          onChange={onChangeSubareas}
          value={selectedSubareas}
          className="c-filters__select"
          style={{ margninBottom: '2rem' }}
        />
      </div>}
  </div>
)

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
  withState('subareas', 'setSubareas', []),
  withState('selectedAreas', 'setSelectedAreas', []),
  withState('selectedSubareas', 'setSelectedSubareas', []),
  withHandlers({
    getSubareas: ({ setSubareas }) => areas => {
      api.getMlsSubareas(areas).then(subareas => {
        setSubareas(subareas)
      })
    }
  }),
  withHandlers({
    onChangeAreas: ({
      selectedAreas,
      getSubareas,
      setSubareas,
      setSelectedAreas,
      selectedSubareas,
      setSelectedSubareas
    }) => areas => {
      setSelectedAreas(areas, getSubareas(areas))
      if (areas.length === 0 && selectedSubareas.length > 0) {
        setSelectedSubareas([])
      }
    },
    onChangeSubareas: ({ setSelectedSubareas, selectedSubareas }) => areas => {
      setSelectedSubareas(areas)
    }
  })
)(MlsAreaSelects)
