import React from 'react'

import { List, ListItem, Tooltip } from '@material-ui/core'
import { mdiAttachment, mdiDropbox, mdiProgressUpload } from '@mdi/js'
import { useField } from 'react-final-form'
import { useDropboxChooser } from 'use-dropbox-chooser/lib'

/*
 * We use `/lib` to force Webpack to fetch the source code of the library and build it itself.
 * This is because the library builds using Rollup, which uses regenerateRuntime without providing
 * a proper polyfill for it. It appesrs that in the normal code path this is not a problem.
 * But if the user has an ad blocker, loading the script would fail, and it'd follow to use
 * regenerateRuntime functions which don't exist, leading to web#5914.
 *
 * The only way I managed to get a nice build out of it is using a .browserslists file
 * that includes IE 11. This would cause babel-preset-env to include a massive, massive load of polyfills
 * which basically doubles the size of our bundle.
 *
 * This allows us to skip those polyfills because it'd just use Webpack to build the library.
 */

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import {
  uploadEmailAttachment,
  UploadOrigin
} from 'models/email/upload-email-attachment'

import config from '../../../../../../config/public'
import { BaseDropdown } from '../../../BaseDropdown'
import { DropdownToggleButton } from '../../../DropdownToggleButton'
import { FilePicker } from '../../../FilePicker'
import { useUploadAttachment } from '../../helpers/use-upload-attachment'
import AddDealFile from '../AddDealFile'

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
  onClickAddDealAttachments
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
            defaultSelectedDeal={deal}
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
