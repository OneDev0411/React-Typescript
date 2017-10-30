import types from '../../constants/chatroom'

export function insertDraft(draft) {
  return {
    type: types.INSERT_DRAFT,
    draft
  }
}

