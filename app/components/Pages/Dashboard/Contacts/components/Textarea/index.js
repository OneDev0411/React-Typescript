import React from 'react'
import cn from 'classnames'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

class EditableTextarea extends React.Component {
  constructor(props) {
    super(props)

    const { item } = props

    const value =
      (item.attribute_def && item[item.attribute_def.data_type]) || ''

    this.state = {
      value,
      isActive: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handelOnDelete = this.handelOnDelete.bind(this)
  }

  async handleSubmit() {
    const { value } = this.state
    const { item, onSubmit } = this.props

    if (!value) {
      return false
    }

    const dataType = item.attribute_def.data_type
    const itemPreviousValue = item[dataType]

    if (typeof onSubmit === 'function' && value !== itemPreviousValue) {
      await onSubmit([{ ...item, [dataType]: value }])
    }

    this.setState({ isActive: false })
  }

  async handelOnDelete() {
    const { item, onDelete } = this.props

    await onDelete(item)
    this.setState({
      value: ''
    })
  }

  setValue = event => {
    const { value } = event.target

    this.setState({ value })
  }

  onClickEdit = () => {
    this.setState({ isActive: true })
  }

  getTextare = () => {
    const { disabled, item } = this.props
    const { value } = this.state

    return (
      <div className="c-editable-textarea__edit-mode">
        <textarea
          name="textarea"
          disabled={disabled}
          defaultValue={value}
          onChange={this.setValue}
          className="c-editable-textarea__input"
        />
        {value &&
          item.note !== value && (
            <ActionButton
              disabled={disabled}
              onClick={this.handleSubmit}
              className="c-editable-textarea__edit-mode__submit-btn"
            >
              {disabled ? 'Saving...' : 'Save'}
            </ActionButton>
          )}
      </div>
    )
  }

  getGhostitem = () => {
    const { item } = this.props
    const { value, isActive } = this.state

    return (
      <div className="c-editable-textarea__ghost-mode">
        <div
          onClick={this.onClickEdit}
          dangerouslySetInnerHTML={{ __html: value }}
          className="c-editable-textarea__ghost-mode__text"
        />
        {!isActive && (
          <div className="c-editable-field__controlers">
            {item.id && (
              <span
                data-balloon-pos="up"
                data-balloon="Delete"
                style={{ fontSize: '1.8rem' }}
                className="c-editable-field__controlers__item"
              >
                <i onClick={this.handelOnDelete} className="fa fa-trash" />
              </span>
            )}
          </div>
        )}
      </div>
    )
  }

  render() {
    const { isActive } = this.state

    return (
      <div
        className={cn('c-editable-textarea', {
          'is-active': isActive
        })}
      >
        {isActive ? this.getTextare() : this.getGhostitem()}
      </div>
    )
  }
}

export default EditableTextarea
