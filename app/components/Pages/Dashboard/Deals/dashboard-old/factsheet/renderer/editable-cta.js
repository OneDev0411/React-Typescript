import React from 'react'
import ToolTip from '../../../../../../../views/components/tooltip/index'
import ActionButton from 'components/Button/ActionButton'
import { css } from 'styled-components'
import IconButton from 'components/Button/IconButton'
import { primary } from 'views/utils/colors'
import { grey } from '../../../../../../../views/utils/colors'

const EditButton = ActionButton.extend`
  padding: 0 0.5rem;
  ${({ hide }) =>
    hide &&
    css`
      display: none !important;
    `};
`

const DeleteButton = IconButton.extend`
  padding: 0;
  color: ${grey.A600};
  &:hover {
    color: ${primary};
  }
  ${({ hide }) =>
    hide &&
    css`
      display: none !important;
    `};
`
export default ({
  showCTA,
  needsApproval,
  contextData,
  handleEditField,
  handleDeleteField
}) => (
  <span className="cta">
    <ToolTip
      caption={
        needsApproval ? 'This field needs office approval after changing' : null
      }
    >
      <EditButton
        size="small"
        appearance="link"
        onClick={handleEditField}
        hide={!showCTA}
        className="cta__button"
      >
        EDIT
      </EditButton>
    </ToolTip>

    <ToolTip
      caption={
        needsApproval ? 'This field needs office approval after removing' : null
      }
    >
      <DeleteButton
        size="small"
        onClick={handleDeleteField}
        hide={!showCTA || !contextData.value || contextData.value.length === 0}
        className="cta__button"
      >
        <div className="fa fa-times-circle" />
      </DeleteButton>
    </ToolTip>
  </span>
)
