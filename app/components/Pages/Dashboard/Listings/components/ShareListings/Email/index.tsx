import React, { useState } from 'react'

import { Button, Tooltip } from '@material-ui/core'

import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import MarketingTemplatePickerModal from 'components/MarketingTemplatePickerModal'

export function EmailAction() {
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false)
  const user = useSelector<IAppState, IUser>(({ user }) => user)

  return (
    <>
      <Tooltip title="Send as Email">
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => setIsTemplatesModalOpen(true)}
        >
          Email
        </Button>
      </Tooltip>

      {isTemplatesModalOpen && (
        <MarketingTemplatePickerModal
          title="Select Template"
          user={user}
          onSelect={() => {}}
          onClose={() => setIsTemplatesModalOpen(false)}
        />
      )}
    </>
  )
}
