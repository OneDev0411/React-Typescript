import React from 'react'

import Modal from '../../../BasicModal'
import CancelButton from '../../../Button/CancelButton'
import { Container, SaveButton, ItemRow, ItemTitle, TextInput } from './styled'

export class SaveSegment extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      selectedOption: props.currentFilter ? 'Current' : 'New',
      newFilterName: ''
    }
  }

  toggleShowModal = () => this.setState({ showModal: !this.state.showModal })

  changeSelectedOption = option => this.setState({ selectedOption: option })

  onNewFilterNameChange = newFilterName => this.setState({ newFilterName })

  saveList = () => {}

  render() {
    const { showModal, selectedOption, newFilterName } = this.state
    const { currentFilter } = this.props

    return (
      <Container>
        <SaveButton onClick={this.toggleShowModal}>Save Search</SaveButton>

        <Modal
          isOpen={showModal}
          onRequestClose={this.toggleShowModal}
          className="half-size"
        >
          <Modal.Header title="Save list" />
          <Modal.Body style={{ height: '115px' }}>
            {currentFilter && (
              <ItemRow onClick={() => this.changeSelectedOption('Current')}>
                <input
                  type="radio"
                  checked={selectedOption === 'Current'}
                  onChange={() => null}
                />
                <ItemTitle>
                  Save changes to the list <b>‘{currentFilter}’</b>
                </ItemTitle>
              </ItemRow>
            )}

            <ItemRow onClick={() => this.changeSelectedOption('New')}>
              <input
                type="radio"
                checked={selectedOption === 'New'}
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
            <CancelButton onClick={this.toggleShowModal}>Cancel</CancelButton>
            <SaveButton padLeft={5} onClick={this.saveList}>
              Save new list
            </SaveButton>
          </Modal.Footer>
        </Modal>
      </Container>
    )
  }
}
