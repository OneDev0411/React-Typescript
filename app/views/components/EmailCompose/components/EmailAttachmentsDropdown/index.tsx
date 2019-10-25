import { List, ListItem } from '@material-ui/core'
import * as React from 'react'

import { Field } from 'react-final-form'

import IconUpload from 'components/SvgIcons/Upload/IconUpload'
import IconAttachment from 'components/SvgIcons/Attachment/IconAttachment'

import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

import { useIconStyles } from '../../../../../styles/use-icon-styles'
import { BaseDropdown } from '../../../BaseDropdown'
import { FilePicker } from '../../../FilePicker'
import AddDealFile from '../AddDealFile'
import { iconSizes } from '../../../SvgIcons/icon-sizes'
import { UploadAttachment } from '../../fields/UploadAttachment'

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
            deal={deal}
            initialAttachments={initialAttachments}
            component={AddDealFile}
            onChanged={onChanged}
            onClick={close}
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
                      <IconUpload
                        size={iconSizes.small}
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
