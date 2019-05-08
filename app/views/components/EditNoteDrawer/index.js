import React from 'react'
import PropTypes from 'prop-types'

import Drawer from '../OverlayDrawer'
import Button from '../Button/ActionButton'
import IconButton from '../Button/IconButton'
import IconDelete from '../SvgIcons/DeleteOutline/IconDeleteOutline'
import Alert from '../../../components/Pages/Dashboard/Partials/Alert'

import { Container } from './styled'
import { TextEditor } from '../TextEditor'

const propTypes = {
  ...Drawer.propTypes,
  note: PropTypes.shape().isRequired,
  onSubmit: PropTypes.func.isRequired
}

const defaultProps = Drawer.defaultProps

export class EditNoteDrawer extends React.Component {
  state = {
    error: null,
    isSaving: false,
    text: this.props.note.text
  }

  onChange = value => {
    this.setState({ text: value })
  }

  onSubmit = async () => {
    try {
      this.setState({ isSaving: true })

      await this.props.onSubmit({
        ...this.props.note,
        text: this.state.text
      })

      this.setState({ isSaving: false, text: '' }, this.props.onClose)
    } catch (error) {
      console.log(error)
      this.setState({ isSaving: false, error })
    }
  }

  onDelete = async () => {
    try {
      this.setState({ isSaving: true })

      await this.props.onDelete(this.props.note)

      this.setState({ isSaving: false, text: '' }, this.props.onClose)
    } catch (error) {
      console.log(error)
      this.setState({ isSaving: false, error })
    }
  }

  render() {
    const { isSaving } = this.state

    return (
      <Drawer isOpen={this.props.isOpen} onClose={this.props.onClose}>
        <Drawer.Header title="Edit Note" />
        <Drawer.Body style={{ overflow: 'hidden' }}>
          <Container>
            <TextEditor
              disabled={isSaving}
              defaultValue={this.state.text}
              onChange={this.onChange}
            />
            {this.state.error && (
              <Alert type="error" message={this.state.error.message} />
            )}
          </Container>
        </Drawer.Body>
        <Drawer.Footer>
          {this.state.isDeleting ? (
            'Deleting...'
          ) : (
            <IconButton
              isFit
              inverse
              onClick={this.onDelete}
              disabled={isSaving}
            >
              <IconDelete />
            </IconButton>
          )}
          <Button onClick={this.onSubmit} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </Drawer.Footer>
      </Drawer>
    )
  }
}

EditNoteDrawer.propTypes = propTypes
EditNoteDrawer.defaultProps = defaultProps
