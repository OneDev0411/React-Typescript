import uniqBy from 'lodash/uniqBy'

import {
  EmailFormValues,
  UrlBasedEmailAttachmentInput
} from 'components/EmailCompose'

import { DealTaskActionsStateContext } from '..'
import { SELECT_TASK } from '../../../components/ActionsButton/data/action-buttons'
import {
  ADD_ATTACHMENTS,
  CANCEL,
  RESET,
  REMOVE_ATTACHMENT,
  SELECT_TASKS,
  SET_DRAWER_STATUS,
  SET_FORM_META,
  SET_MODE
} from '../constants'

export const initialState: DealTaskActionsStateContext = {
  type: '',
  isDrawerOpen: false,
  actions: [],
  attachments: [],
  tasks: [],
  form: undefined,
  buttons: undefined,
  mode: {
    type: null,
    taskId: null
  }
}

export function reducer(
  state = initialState,
  action: any
): DealTaskActionsStateContext {
  switch (action.type) {
    case ADD_ATTACHMENTS:
      return {
        ...initialState,
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

    case SELECT_TASKS:
      return {
        ...state,
        ...action,
        actions: [SELECT_TASK]
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
    case RESET:
      return {
        ...state,
        ...initialState
      }

    case SET_MODE: {
      return {
        ...state,
        mode: action.mode
      }
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
