import React from 'react'
import { connect } from 'react-redux'

import MUIButton from '@material-ui/core/Button'

import {
  createFilterSegment,
  updateFilterSegment,
  changeActiveFilterSegment
} from 'store_actions/filter-segments'

import { CRM_LIST_DEFAULT_ASSOCIATIONS } from 'models/contacts/helpers/default-query'

import Modal from 'components/BasicModal'
import Button from 'components/Button/ActionButton'

import RadioButton from 'components/RadioButton'
import { isFilterValid } from 'components/Grid/Filters/helpers/is-filter-valid'

import { Container, ItemRow, ItemTitle, TextInput } from './styled'

const DEFAULT_QUERY = {
  associations: CRM_LIST_DEFAULT_ASSOCIATIONS
}

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
    const { props } = this
    const { dispatch, name } = props
    const segment = this.getSegmentObject()

    this.setState({
      isSaving: true
    })

    try {
      if (segment.id) {
        await props.dispatch(
          updateFilterSegment(
            props.name,
            {
              ...props.segment,
              ...segment
            },
            DEFAULT_QUERY
          )
        )
      } else {
        const newSegment = await dispatch(
          createFilterSegment(name, segment, DEFAULT_QUERY)
        )

        dispatch(changeActiveFilterSegment(name, newSegment.id))
      }

      this.setState({
        isSaving: false,
        newFilterName: '',
        selectedOption: CURRENT_SEGMENT,
        showModal: false
      })
    } catch (error) {
      console.error(error)
      this.setState({
        isSaving: false
      })
    }
  }

  getButtonCaption = () => {
    const { selectedOption, isSaving } = this.state

    if (isSaving) {
      return 'Saving ...'
    }

    return selectedOption === CURRENT_SEGMENT ? 'Update list' : 'Save new list'
  }

  render() {
    let areFiltersValid = true
    const { state, props } = this
    const { selectedOption } = state
    const { filters = {}, segment } = props
    const hasFilters =
      Object.keys(filters).length > 0 || this.isEditable(segment)

    if (hasFilters) {
      areFiltersValid = Object.values(filters).every(isFilterValid)
    }

    return (
      <Container>
        {hasFilters && (
          <MUIButton
            variant="outlined"
            size="small"
            data-test="save-list-button"
            onClick={this.toggleShowModal}
            disabled={!areFiltersValid}
          >
            Save List
          </MUIButton>
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
                <ItemTitle data-test="create-new-list">
                  Create new list
                </ItemTitle>
                <TextInput
                  type="text"
                  value={state.newFilterName}
                  placeholder="Enter new list name"
                  onChange={this.onNewFilterNameChange}
                  data-test="new-list-name-input"
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
                data-test="save-list-button-modal"
              >
                {this.getButtonCaption()}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    )
  }
}

export default connect()(SaveSegment)
