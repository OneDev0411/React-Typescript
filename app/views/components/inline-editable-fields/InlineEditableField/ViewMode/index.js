import React from 'react'
import PropTypes from 'prop-types'

import { noop } from 'utils/helpers'

import IconButton from 'components/Button/IconButton'
import AddIcon from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

import { Container, Label, Value, ActionBar, EditButton } from './styled'

ViewMode.propTypes = {
  handleAddNew: PropTypes.func,
  label: PropTypes.string,
  renderMenu: PropTypes.func,
  renderBody: PropTypes.func,
  showAdd: PropTypes.bool,
  showEdit: PropTypes.bool,
  toggleMode: PropTypes.func.isRequired,
  value: PropTypes.string
}

ViewMode.defaultProps = {
  handleAddNew: noop,
  label: 'Label',
  renderMenu: noop,
  renderBody: noop,
  showAdd: false,
  showEdit: true,
  value: '-'
}

export function ViewMode(props) {
  const { label, value, toggleMode, renderBody } = props

  return (
    <Container onClick={toggleMode}>
      {renderBody() == null ? (
        <React.Fragment>
          <Label>{label}</Label>
          <Value>{value}</Value>
        </React.Fragment>
      ) : (
        renderBody({ label, value, toggleMode })
      )}
      <ActionBar className="action-bar">
        {props.renderMenu()}
        {props.showAdd && (
          <IconButton
            isFit
            onClick={props.handleAddNew}
            style={{ marginRight: '0.5em' }}
          >
            <AddIcon />
          </IconButton>
        )}
        {props.showEdit && (
          <EditButton appearance="link" onClick={toggleMode}>
            Edit
          </EditButton>
        )}
      </ActionBar>
    </Container>
  )
}
