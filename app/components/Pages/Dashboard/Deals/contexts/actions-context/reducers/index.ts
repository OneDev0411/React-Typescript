import uniqBy from 'lodash/uniqBy'

import {
  EmailFormValues,
  UrlBasedEmailAttachmentInput
} from 'components/EmailCompose'

import { StateContext } from '..'
import {
  ADD_ATTACHMENTS,
  CANCEL,
  REMOVE_ATTACHMENT,
  SET_DRAWER_STATUS,
  SET_FORM_META
} from '../constants'

export const initialState: StateContext = {
  isDrawerOpen: false,
  actions: [],
  attachments: [],
  form: undefined
}

export function reducer(state = initialState, action: any): StateContext {
  switch (action.type) {
    case ADD_ATTACHMENTS:
      return {
        ...state,
        actions: action.actions ?? state.actions,
        attachments: action.attachments
          ? uniqBy(
              [...state.attachments, ...(action.attachments || [])],
              getAttachmentIdentifier
            )
          : state.attachments,
        form: state.form && {
          ...state.form,
          attachments: action.attachments
            ? uniqBy(
                [...state.form.attachments, ...(action.attachments || [])],
                getAttachmentIdentifier
              )
            : state.form.attachments
        }
      }

    case REMOVE_ATTACHMENT:
      return {
        ...state,
        attachments: state.attachments.filter(
          attachment => !areAttachmentsTheSame(attachment, action.attachment)
        ),
        form:
          state.form &&
          ({
            ...state.form,
            attachments: state.form.attachments.filter(
              attachment =>
                !areAttachmentsTheSame(attachment, action.attachment)
            )
          } as EmailFormValues)
      }

    case SET_DRAWER_STATUS:
      return {
        ...state,
        isDrawerOpen: action.isDrawerOpen
      }

    case SET_FORM_META:
      return {
        ...state,
        form: action.form,
        attachments: !Array.isArray(action.form.attachments)
          ? []
          : state.attachments.filter(attachment =>
              action.form.attachments.some(formAttachment =>
                areAttachmentsTheSame(formAttachment, attachment)
              )
            )
      }

    case CANCEL:
      return {
        ...state,
        ...initialState
      }

    default:
      return state
  }
}

type Attachment = IFile | IDealFile | UrlBasedEmailAttachmentInput

function getAttachmentIdentifier(
  attachment: Attachment
): string | null | undefined {
  return 'id' in attachment && attachment.id ? attachment.id : attachment.url
}

function areAttachmentsTheSame(
  firstAttachment: Attachment,
  secondAttachment: Attachment
): boolean {
  return (
    getAttachmentIdentifier(firstAttachment) ===
    getAttachmentIdentifier(secondAttachment)
  )
}
