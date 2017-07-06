import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import defaultProps from 'recompose/defaultProps'
import withPropsOnChange from 'recompose/withPropsOnChange'

import Select from 'react-select'

const getAreas = async () => {
  try {
    const response = await fetch(
      'https://boer.d.rechat.com/areas/search?parents[]=0'
    )

    const responseData = await response.json()
    return responseData.data.map(({ title, number }) => ({
      label: title,
      value: number
    }))
  } catch (error) {
    // console.log(error.message)
  }
}

const getSubareas = async areas => {
  console.log(areas)
  const query = areas.map(({ value }) => `parents[]=${value}`).join('&')

  if (!query) {
    return Promise.resolve()
  }

  try {
    const response = await fetch(
      `https://boer.d.rechat.com/areas/search?${query}`
    )

    const responseData = await response.json()
    console.log(responseData)
    return responseData.data.map(({ title, number }) => ({
      value: number,
      label: `${title}: #${number}`
    }))
  } catch (error) {
    // console.log(error.message)
  }
}

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
  <div>
    <Select
      multi
      name="mls_areas"
      options={areas}
      value={selectedAreas}
      placeholder="Area #..."
      onChange={onChangeAreas}
      className="c-filters__multi-select"
    />
    {subareas.length > 0 &&
      <Select
        multi
        name="subareas"
        options={subareas}
        placeholder="Subarea #..."
        onChange={onChangeSubareas}
        value={selectedSubareas}
        className="c-filters__multi-select"
      />}
  </div>
)

export default compose(
  lifecycle({
    componentDidMount() {
      getAreas().then(areas => {
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
      getSubareas(areas).then(subareas => {
        setSubareas(subareas)
      })
    }
  }),
  withHandlers({
    onChangeAreas: ({
      setSelectedAreas,
      selectedAreas,
      getSubareas,
      setSubareas
    }) => areas => {
      setSelectedAreas(areas, getSubareas(areas))
    },
    onChangeSubareas: ({ setSelectedSubareas, selectedSubareas }) => areas => {
      setSelectedSubareas(areas)
    }
  })
)(MlsAreaSelects)
