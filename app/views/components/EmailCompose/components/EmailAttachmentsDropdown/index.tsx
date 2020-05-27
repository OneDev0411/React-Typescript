import { List, ListItem } from '@material-ui/core'
import { useDropboxChooser } from 'use-dropbox-chooser'
import * as React from 'react'

import { Field } from 'react-final-form'

import { mdiAttachment, mdiDropbox, mdiProgressUpload } from '@mdi/js'

import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useIconStyles } from '../../../../../styles/use-icon-styles'
import { BaseDropdown } from '../../../BaseDropdown'
import { FilePicker } from '../../../FilePicker'
import AddDealFile from '../AddDealFile'
import { UploadAttachment } from '../../fields/UploadAttachment'
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

  const dropboxChooser = useDropboxChooser({
    appKey: config.dropbox.app_key,
    chooserOptions: {
      multiselect: true,
      linkType: 'direct'
    }
  })

  return (
    <BaseDropdown
      buttonLabel={
        <>
          <SvgIcon path={mdiAttachment} className={iconClasses.rightMargin} />
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
                <SvgIcon
                  path={mdiDropbox}
                  className={iconClasses.rightMargin}
                />
                Attach from dropbox
              </ListItem>
            )}
          />
          <UploadAttachment uploadAttachment={uploadAttachment}>
            {({ upload }) => {
              const uploadFromComputer = (files: FileList) => {
                upload(files)
                onChanged()
              }

              return (
                <FilePicker onFilePicked={uploadFromComputer}>
                  {({ pickFiles }) => (
                    <ListItem
                      button
                      onClick={() => {
                        pickFiles()
                        close()
                      }}
                    >
                      <SvgIcon
                        path={mdiProgressUpload}
                        className={iconClasses.rightMargin}
                      />
                      Attach from your computer
                    </ListItem>
                  )}
                </FilePicker>
              )
            }}
          </UploadAttachment>
        </List>
      )}
    />
  )
}
