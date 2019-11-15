import React, { Fragment } from 'react'

import Tooltip from 'components/tooltip'
import IconFolder from 'components/SvgIcons/Folder/IconFolder'
import IconButton from 'components/Button/IconButton'
import AttachmentsSelectDrawer from 'components/SelectDealFileDrawer'

export function AddAttachment(props) {
  const handleChangeSelectedDocuments = documents => {
    props.input.onChange(documents)
    props.onSelectAttachments()
  }

  return (
    <Fragment>
      <Tooltip caption="Select Documents">
        <IconButton
          iconSize="XLarge"
          isFit
          onClick={props.handleOpenAttachments}
        >
          <IconFolder style={{ fill: '#000' }} />
        </IconButton>
      </Tooltip>

      {props.isAttachmentDrawerOpen && (
        <AttachmentsSelectDrawer
          isOpen
          initialAttachments={props.initialAttachments}
          defaultSelectedItems={props.input.value}
          dealId={props.deal.id}
          onChangeSelectedDocuments={handleChangeSelectedDocuments}
          onClose={props.handleCloseAttachments}
        />
      )}
    </Fragment>
  )
}
