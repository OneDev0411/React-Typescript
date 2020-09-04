import React from 'react'
import { useField } from 'react-final-form'
import { List, ListItem, Tooltip } from '@material-ui/core'
import { useDropboxChooser } from 'use-dropbox-chooser'
import { mdiAttachment, mdiDropbox, mdiProgressUpload } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import {
  uploadEmailAttachment,
  UploadOrigin
} from 'models/email/upload-email-attachment'

import { DropdownToggleButton } from '../../../DropdownToggleButton'
import { BaseDropdown } from '../../../BaseDropdown'
import { FilePicker } from '../../../FilePicker'
import AddDealFile from '../AddDealFile'
import { useUploadAttachment } from '../../helpers/use-upload-attachment'
import config from '../../../../../../config/public'

interface Props {
  deal?: IDeal
  initialAttachments: IFile[]
  /**
   * Called when attachments from deals are changed or a new attachment
   * starts to upload. Note that it's not called when an upload is finished
   * and a new attachment is added because of that.
   */
  onChanged?: () => void
  onClickAddDealAttachments?: () => void
  uploadAttachment: typeof uploadEmailAttachment
  uploadOrigin: UploadOrigin
}

export function EmailAttachmentsDropdown({
  deal,
  initialAttachments,
  uploadAttachment,
  uploadOrigin,
  onChanged = () => {},
  onClickAddDealAttachments = () => {}
}: Props) {
  const attachmentsField = useField('attachments')
  const [upload] = useUploadAttachment(uploadAttachment, uploadOrigin)

  const dropboxChooser = useDropboxChooser({
    appKey: config.dropbox.app_key,
    chooserOptions: {
      multiselect: true,
      linkType: 'direct'
    }
  })

  const uploadFromComputer = (files: FileList) => {
    upload(files)
    onChanged()
  }

  return (
    <BaseDropdown
      renderDropdownButton={buttonProps => (
        <Tooltip title="Attach a File">
          <DropdownToggleButton {...buttonProps}>
            <SvgIcon path={mdiAttachment} rightMargined />
          </DropdownToggleButton>
        </Tooltip>
      )}
      PopperProps={{ keepMounted: true }}
      renderMenu={({ close }) => (
        <List>
          <AddDealFile
            deafultSelectedDeal={deal}
            initialAttachments={initialAttachments}
            onChange={files => {
              attachmentsField.input.onChange(files)
              onChanged()
            }}
            onClick={close}
            onClickAddDealAttachments={onClickAddDealAttachments}
            value={attachmentsField.input.value}
          />
          <ListItem
            button
            disabled={dropboxChooser.isOpen}
            onClick={async () => {
              try {
                const files = await dropboxChooser.open()

                if (attachmentsField.input) {
                  const { onChange, value } = attachmentsField.input

                  onChange([
                    ...(value || []),
                    ...files.map(
                      ({ name, link }) =>
                        ({
                          name,
                          is_inline: false,
                          url: link
                        } as IEmailAttachmentUrlInput)
                    )
                  ] as any)
                }
              } catch (e) {}

              close()
            }}
          >
            <SvgIcon path={mdiDropbox} rightMargined />
            Attach from dropbox
          </ListItem>
          <FilePicker onFilePicked={uploadFromComputer}>
            {({ pickFiles }) => (
              <ListItem
                button
                onClick={() => {
                  pickFiles()
                  close()
                }}
              >
                <SvgIcon path={mdiProgressUpload} rightMargined />
                Attach from your computer
              </ListItem>
            )}
          </FilePicker>
        </List>
      )}
    />
  )
}
