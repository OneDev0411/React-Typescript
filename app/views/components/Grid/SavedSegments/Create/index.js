import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import {
  createFilterSegment,
  updateFilterSegment,
  changeActiveFilterSegment
} from 'store_actions/filter-segments'

import Modal from 'components/BasicModal'
import Button from 'components/Button/ActionButton'
import RadioButton from 'components/RadioButton'
import { isFilterValid } from 'components/Grid/Filters/helpers/is-filter-valid'

import { ItemRow, ItemTitle, TextInput } from './styled'

const CURRENT_SEGMENT = 0
const NEW_SEGMENT = 1

class SaveSegment extends React.Component {
  constructor(props) {
    super(props)

    const selectedOption = this.isEditable(props.segment)
      ? CURRENT_SEGMENT
      : NEW_SEGMENT

    this.state = {
      isSaving: false,
      newFilterName: '',
      selectedOption,
      showModal: false
    }
  }

  toggleShowModal = () =>
    this.setState(state => ({ showModal: !state.showModal }))

  changeSelectedOption = option => this.setState({ selectedOption: option })

  onNewFilterNameChange = event =>
    this.setState({ newFilterName: event.target.value })

  isEditable = segment => segment && segment.is_editable === true

  canSaveList = () => {
    const { selectedOption, newFilterName, isSaving } = this.state

    if (
      (selectedOption === NEW_SEGMENT && newFilterName.trim() === '') ||
      isSaving
    ) {
      return false
    }

    return true
  }

  getSegmentObject = () => {
    const { selectedOption, newFilterName } = this.state
    const { segment, filters } = this.props

    const list = {}

    if (selectedOption === CURRENT_SEGMENT) {
      list.id = segment.id
    }

    if (selectedOption === NEW_SEGMENT) {
      list.name = newFilterName.trim()
    }

    return {
      ...list,
      ...this.props.createSegmentFromFilters(filters)
    }
  }

  saveList = async () => {
    const segment = this.getSegmentObject()

    this.setState({
      isSaving: true
    })

    try {
      if (segment.id) {
        await this.updateSegment(segment)
      } else {
        const newSegmentId = await this.createSegment(segment)

        this.props.dispatch(
          changeActiveFilterSegment(this.props.name, newSegmentId)
        )
      }

      this.setState({
        isSaving: false,
        newFilterName: '',
        selectedOption: CURRENT_SEGMENT,
        showModal: false
      })
    } catch (e) {
      console.log(e)
      this.setState({
        isSaving: false
      })
    }
  }

  updateSegment = segment =>
    this.props.dispatch(
      updateFilterSegment(this.props.name, {
        ...this.props.segment,
        ...segment
      })
    )

  createSegment = segment =>
    this.props.dispatch(createFilterSegment(this.props.name, segment))

  getButtonCaption = () => {
    const { selectedOption, isSaving } = this.state

    if (isSaving) {
      return 'Saving ...'
    }

    return selectedOption === CURRENT_SEGMENT ? 'Update list' : 'Save new list'
  }

  render() {
    const { state, props } = this
    const { selectedOption } = state
    const { filters, segment } = props
    const hasFilters = _.size(filters) > 0 || this.isEditable(segment)
    const areFiltersValid = _.values(filters || {}).every(isFilterValid)

    return (
      <div>
        {hasFilters && (
          <Button onClick={this.toggleShowModal} disabled={!areFiltersValid}>
            Save List
          </Button>
        )}

        {state.showModal && hasFilters && (
          <Modal
            isOpen
            className="half-size"
            handleOnClose={this.toggleShowModal}
          >
            <Modal.Header title="Save list" />
            <Modal.Body style={{ height: '115px' }}>
              {this.isEditable(segment) && (
                <ItemRow
                  onClick={() => this.changeSelectedOption(CURRENT_SEGMENT)}
                >
                  <RadioButton selected={selectedOption === CURRENT_SEGMENT} />
                  <ItemTitle>
                    Save changes to the list <b>‘{segment.name}’</b>
                  </ItemTitle>
                </ItemRow>
              )}

              <ItemRow onClick={() => this.changeSelectedOption(NEW_SEGMENT)}>
                <RadioButton selected={selectedOption === NEW_SEGMENT} />
                <ItemTitle>Create new list</ItemTitle>
                <TextInput
                  type="text"
                  value={state.newFilterName}
                  placeholder="Enter new list name"
                  onChange={this.onNewFilterNameChange}
                />
              </ItemRow>
            </Modal.Body>

            <Modal.Footer>
              <Button
                size="small"
                appearance="outline"
                disabled={state.isSaving}
                onClick={this.toggleShowModal}
                style={{ marginRight: '0.5em' }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                disabled={!this.canSaveList()}
                onClick={this.saveList}
              >
                {this.getButtonCaption()}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    )
  }
}

export default connect()(SaveSegment)
