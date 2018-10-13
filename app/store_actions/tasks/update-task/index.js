import { normalize } from 'normalizr'
import * as actionTypes from '../../../constants/tasks'
import { tasksSchema } from '../../../models/tasks/schema'
import { updateTask as postTask } from '../../../models/tasks/update-task'
import { updateContactOnStore } from '../../contacts/update-contact'
import { selectContact } from '../../../reducers/contacts/list'

export function updateTask(task, query = {}) {
  return async (dispatch, getState) => {
    if (!task || !task.id) {
      const error = new Error('Task is required.')

      dispatch({
        error,
        type: actionTypes.UPDATE_TASK_FAILURE
      })
      throw error
    }

    try {
      dispatch({
        type: actionTypes.UPDATE_TASK_REQUEST
      })

      const updatedTask = await postTask(task, query)
      const newTask = {
        ...task,
        ...updatedTask
      }
      const response = normalize({ tasks: [newTask] }, tasksSchema)

      dispatch({
        response,
        type: actionTypes.UPDATE_TASK_SUCCESS
      })

      updateContacts(updatedTask, dispatch, getState)

      return newTask
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.UPDATE_TASK_FAILURE
      })
    }
  }
}

export function updateContacts(task, dispatch, getState) {
  task.contacts &&
    task.contacts.forEach(contactId => {
      const {
        contacts: { list }
      } = getState()
      const contact = selectContact(list, contactId)

      if (
        task.status === 'DONE' &&
        task.due_date < Date.now() / 1000 &&
        task.due_date > contact.last_touch
      ) {
        const updatedContact = { ...contact, last_touch: task.due_date }

        updateContactOnStore(updatedContact, dispatch, getState)
      }
    })
}
