import React from 'react'

import { connect } from 'react-redux'
import Select from 'react-select'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import { formValueSelector, change as updateField } from 'redux-form'

import api from '../../../../../../../../models/listings/search'
import Label from '../components/Label'

const formName = 'filters'
const selector = formValueSelector(formName)

const MlsAreaSelects = ({
  areas,
  subareas,
  updateField,
  selectedAreas,
  onChangeAreas,
  loadingSubareas,
  selectedSubareas
}) => (
  <div style={{ marginBottom: '2rem' }}>
    <Label label="MLS Areas">
      <Select
        multi
        name="mlsAreas"
        options={areas}
        value={selectedAreas}
        placeholder="Area #..."
        onChange={onChangeAreas}
        disabled={loadingSubareas}
        className="c-filters__select"
      />
    </Label>
    {selectedAreas.length > 0 && (
      <Label label="MLS Subareas">
        <Select
          multi
          name="mlsSubareas"
          options={subareas}
          addLabelText="MLS Subareas"
          placeholder="Subarea #..."
          value={selectedSubareas}
          disabled={loadingSubareas}
          className="c-filters__select"
          style={{ margninBottom: '2rem' }}
          onChange={areas => updateField(formName, 'mlsSubareas', areas)}
        />
      </Label>
    )}
  </div>
)

export default compose(
  connect(
    state => {
      const selectedAreas = selector(state, 'mlsAreas') || []
      const selectedSubareas = selector(state, 'mlsSubareas') || []

      return {
        selectedAreas,
        selectedSubareas
      }
    },
    { updateField }
  ),
  withState('subareas', 'setSubareas', []),
  withState('loadingSubareas', 'setLoadingSubareas', false),
  withHandlers({
    getSubareas:
      ({ setSubareas, setLoadingSubareas }) =>
      async areas => {
        setLoadingSubareas(true)

        const subareas = await api.getMlsSubAreas(
          areas.map(({ value }) => value)
        )

        setSubareas(
          subareas.map(({ title, number, parent }) => ({
            parent,
            value: number,
            label: `${title}: #${number}`
          }))
        )
        setLoadingSubareas(false)
      }
  }),
  withHandlers({
    onChangeAreas:
      ({ getSubareas, updateField, selectedAreas, selectedSubareas }) =>
      areas => {
        if (areas.length === 0) {
          updateField(formName, 'mlsAreas', [])

          if (selectedSubareas.length > 0) {
            updateField(formName, 'mlsSubareas', [])

            return
          }

          return
        }

        // delete subareas when theirs parent deleted.
        if (areas.length < selectedAreas.length) {
          const subareas = selectedSubareas.map(subarea => {
            const hasParent = areas.some(area => subarea.parent === area.value)

            if (hasParent) {
              return subarea
            }
          })

          getSubareas(areas)
          updateField(formName, 'mlsSubareas', subareas)
        }

        getSubareas(areas)
        updateField(formName, 'mlsAreas', areas)
      }
  }),
  lifecycle({
    componentDidMount() {
      api.getMlsAreas().then(areas => {
        this.setState({
          areas: areas.map(({ title, number, parent }) => ({
            parent,
            label: title,
            value: number
          }))
        })
      })

      const { selectedAreas, getSubareas } = this.props

      if (selectedAreas.length > 0) {
        getSubareas(selectedAreas)
      }
    }
  })
)(MlsAreaSelects)
