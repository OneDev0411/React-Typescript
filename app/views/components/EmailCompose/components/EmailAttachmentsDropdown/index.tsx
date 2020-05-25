import { List, ListItem } from '@material-ui/core'
import { useDropboxChooser } from 'use-dropbox-chooser'
import * as React from 'react'

import { Field } from 'react-final-form'

import IconUpload from 'components/SvgIcons/Upload/IconUpload'
import IconAttachment from 'components/SvgIcons/Attachment/IconAttachment'
import IconDropbox from 'components/SvgIcons/Dropbox/IconDropbox'

import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

import { useIconStyles } from '../../../../../styles/use-icon-styles'
import { BaseDropdown } from '../../../BaseDropdown'
import { FilePicker } from '../../../FilePicker'
import AddDealFile from '../AddDealFile'
import { iconSizes } from '../../../SvgIcons/icon-sizes'
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
  uploadAttachment: typeof uploadEmailAttachment
}

export function EmailAttachmentsDropdown({
  deal,
  initialAttachments,
  uploadAttachment,
  onChanged = () => {}
}: Props) {
  const iconClasses = useIconStyles()
  const [upload] = useUploadAttachment(uploadAttachment)

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
      buttonLabel={
        <>
          <IconAttachment
            size={iconSizes.small}
            className={iconClasses.rightMargin}
          />{' '}
          Attachments
        </>
      }
      PopperProps={{ keepMounted: true }}
      renderMenu={({ close }) => (
        <List>
          <Field
            name="attachments"
            deafultSelectedDeal={deal}
            initialAttachments={initialAttachments}
            component={AddDealFile}
            onChanged={onChanged}
            onClick={close}
          />
          <Field
            name="attachments"
            render={({ input }) => (
              <ListItem
                button
                disabled={dropboxChooser.isOpen}
                onClick={async () => {
                  try {
                    const files = await dropboxChooser.open()

                    if (input) {
                      input.onChange([
                        ...(input.value || []),
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
                <IconDropbox
                  size={iconSizes.small}
                  className={iconClasses.rightMargin}
                />
                Attach from dropbox
              </ListItem>
            )}
          />
          <FilePicker onFilePicked={uploadFromComputer}>
            {({ pickFiles }) => (
              <ListItem
                button
                onClick={() => {
                  pickFiles()
                  close()
                }}
              >
                <IconUpload
                  size={iconSizes.small}
                  className={iconClasses.rightMargin}
                />
                Attach from your computer
              </ListItem>
            )}
          </FilePicker>
        </List>
      )}
    />
  )
}
