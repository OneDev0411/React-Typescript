import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import Modal from '../../../BasicModal'
import CancelButton from '../../../Button/CancelButton'
import { Container, SaveButton, ItemRow, ItemTitle, TextInput } from './styled'

import createFilterCriteria from '../../Filters/helpers/create-filter-criteria'

import {
  createFilterSegment,
  updateFilterSegment
} from '../../../../../store_actions/filter-segments'

const CURRENT_SEGMENT = 0
const NEW_SEGMENT = 1

class SaveSegment extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      isSaving: false,
      selectedOption: this.isEditable(props.segment)
        ? CURRENT_SEGMENT
        : NEW_SEGMENT,
      newFilterName: ''
    }
  }

  toggleShowModal = () => this.setState({ showModal: !this.state.showModal })

  changeSelectedOption = option => this.setState({ selectedOption: option })

  onNewFilterNameChange = e => this.setState({ newFilterName: e.target.value })

  isEditable = segment => segment && segment.editable !== false

  canSaveList = () => {
    const { selectedOption, newFilterName, isSaving } = this.state

    if ((selectedOption === NEW_SEGMENT && !newFilterName) || isSaving) {
      return false
    }

    return true
  }

  getSegmentObject = () => {
    const { selectedOption, newFilterName } = this.state
    const { segment, filters, config } = this.props

    const list = {
      is_pinned: false
    }

    if (selectedOption === CURRENT_SEGMENT) {
      list.id = segment.id
    }

    if (selectedOption === NEW_SEGMENT) {
      list.name = newFilterName
    }

    return {
      ...list,
      filters: createFilterCriteria(filters, config)
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
        await this.createSegment(segment)
      }

      this.setState({
        showModal: false,
        newFilterName: '',
        selectedOption: CURRENT_SEGMENT,
        isSaving: false
      })
    } catch (e) {
      console.log(e)
      this.setState({
        isSaving: false
      })
    }
  }

  updateSegment = segment => {
    const { name } = this.props

    return this.props.updateFilterSegment(name, {
      ...this.props.segment,
      ...segment
    })
  }

  createSegment = segment => {
    const { name } = this.props

    return this.props.createFilterSegment(name, segment)
  }

  render() {
    const { showModal, selectedOption, newFilterName, isSaving } = this.state
    const { filters, segment } = this.props
    const hasFilters = _.size(filters) > 0

    return (
      <Container>
        {hasFilters && (
          <SaveButton onClick={this.toggleShowModal}>Save Search</SaveButton>
        )}

        <Modal
          isOpen={showModal && hasFilters}
          handleOnClose={this.toggleShowModal}
          className="half-size"
        >
          <Modal.Header title="Save list" />
          <Modal.Body style={{ height: '115px' }}>
            {this.isEditable(segment) && (
              <ItemRow
                onClick={() => this.changeSelectedOption(CURRENT_SEGMENT)}
              >
                <input
                  type="radio"
                  checked={selectedOption === CURRENT_SEGMENT}
                  onChange={() => null}
                />
                <ItemTitle>
                  Save changes to the list <b>‘{segment.name}’</b>
                </ItemTitle>
              </ItemRow>
            )}

            <ItemRow onClick={() => this.changeSelectedOption(NEW_SEGMENT)}>
              <input
                type="radio"
                checked={selectedOption === NEW_SEGMENT}
                onChange={() => null}
              />
              <ItemTitle>Create new list</ItemTitle>
              <TextInput
                type="text"
                value={newFilterName}
                placeholder="Enter new list name"
                onChange={this.onNewFilterNameChange}
              />
            </ItemRow>
          </Modal.Body>

          <Modal.Footer>
            <CancelButton disabled={isSaving} onClick={this.toggleShowModal}>
              Cancel
            </CancelButton>
            <SaveButton
              disabled={!this.canSaveList()}
              padLeft={5}
              onClick={this.saveList}
            >
              {isSaving ? 'Saving ...' : 'Save new list'}
            </SaveButton>
          </Modal.Footer>
        </Modal>
      </Container>
    )
  }
}

export default connect(null, {
  createFilterSegment,
  updateFilterSegment
})(SaveSegment)
