import React from 'react'
import cn from 'classnames'
import ToolTip from '../../../../../../../views/components/tooltip/index'

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
      <span
        onClick={handleEditField}
        className={cn('cta__button', { hide: !showCTA })}
      >
        EDIT
      </span>
    </ToolTip>

    <ToolTip
      caption={
        needsApproval ? 'This field needs office approval after removing' : null
      }
    >
      <button
        className={cn(
          'c-button--shadow cta__button ico-remove fa fa-times-circle',
          {
            hide:
              !showCTA || !contextData.value || contextData.value.length === 0
          }
        )}
        onClick={handleDeleteField}
      />
    </ToolTip>
  </span>
)
