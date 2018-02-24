import _ from 'underscore'
import types from '../../constants/deals'
import uuid from '../../utils/uuid'
import Deal from '../../models/Deal'

export function setUploadFiles(files) {
  const indexedFiles = {}

  // I used properties object to keep file attributes, because file object which
  // created by browser shouldn't change, otherwise upload breaks
  files.forEach(file => {
    const uniqId = uuid()

    indexedFiles[uniqId] = {
      id: uniqId,
      fileObject: file,
      properties: {
        notifyOffice: true
      }
    }
  })

  return {
    type: types.SET_UPLOAD_FILES,
    files: indexedFiles
  }
}

export function setUploadAttributes(fileId, attributes) {
  return {
    type: types.SET_UPLOAD_ATTRIBUTES,
    fileId,
    attributes
  }
}

export function resetUploadFiles() {
  return {
    type: types.RESET_UPLOAD_FILES
  }
}

export function stashFileCreated(deal_id, file) {
  return {
    type: types.ADD_STASH_FILE,
    deal_id,
    file
  }
}

export function stashFileDeleted(deal_id, file_id) {
  return {
    type: types.DELETE_STASH_FILE,
    deal_id,
    file_id
  }
}

export function taskFileCreated(deal_id, checklist_id, task_id, file) {
  return {
    type: types.ADD_TASK_FILE,
    task_id,
    file
  }
}

function taskFileDeleted(task, file_id) {
  return {
    type: types.DELETE_TASK_FILE,
    task_id: task.id,
    file_id
  }
}

export function deleteFile(dealId, files) {
  return async dispatch => {
    await Deal.deleteStashFile(dealId, _.keys(files))

    _.each(files, (task, fileId) => {
      if (task) {
        dispatch(taskFileDeleted(task, fileId))
      } else {
        dispatch(stashFileDeleted(dealId, fileId))
      }
    })
  }
}

/**
 * uploads a file into a deal (stash)
 */
export function uploadStashFile(dealId, file, fileName = null) {
  return async dispatch => {
    try {
      const response = await Deal.uploadStashFile(
        dealId,
        file,
        fileName || file.name
      )

      const fileData = response.body.data

      // add files to deal stash
      dispatch(stashFileCreated(dealId, fileData))

      return fileData
    } catch (e) {
      return null
    }
  }
}

/**
 * uploads a file into a task
 */
export function uploadTaskFile(user, task, file, fileName = null) {
  return async dispatch => {
    try {
      const response = await Deal.uploadTaskFile(
        task.id,
        file,
        fileName || file.name
      )

      const fileData = response.body.data

      Deal.createTaskMessage(task.id, {
        author: user.id,
        room: task.room.id,
        attachments: [fileData.id]
      }).then(() => null)

      // add files to attachments list
      dispatch(taskFileCreated(task.deal, task.checklist, task.id, fileData))

      return fileData
    } catch (e) {
      return null
    }
  }
}
