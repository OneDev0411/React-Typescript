import React from 'react'
import cn from 'classnames'
import ToolTip from '../../../components/tooltip'

export default ({
  showCTA,
  needsApproval,
  context,
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
            hide: !showCTA || !context.value || context.value.length === 0
          }
        )}
        onClick={handleDeleteField}
      />
    </ToolTip>
  </span>
)
