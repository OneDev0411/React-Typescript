// TaskDispatcher.js
import { Dispatcher } from 'flux'

// Tasks
import getTasks from '../actions/tasks/get'
import editTaskStatus from '../actions/tasks/edit-status'
import createTask from '../actions/tasks/create'
import deleteTask from '../actions/tasks/delete'
import addContacts from '../actions/tasks/add-contacts'
import removeContact from '../actions/tasks/remove-contact'

const TaskDispatcher = new Dispatcher()

// Register callback with TransactionDispatcher
TaskDispatcher.register(payload => {
  const action = payload.action

  let title
  let user
  let task
  let status
  let due_date
  let contacts
  let contact

  switch (action) {
    case 'get-tasks':
      user = payload.user
      getTasks(user)
      break

    case 'edit-task-status':
      user = payload.user
      task = payload.task
      status = payload.status
      editTaskStatus(user, task, status)
      break

    case 'create-task':
      user = payload.user
      title = payload.title
      due_date = payload.due_date
      createTask(user, title, due_date)
      break

    case 'delete-task':
      user = payload.user
      task = payload.task
      deleteTask(user, task)
      break

    case 'add-contacts':
      user = payload.user
      task = payload.task
      contacts = payload.contacts
      addContacts(user, task, contacts)
      break

    case 'remove-contact':
      user = payload.user
      task = payload.task
      contact = payload.contact
      removeContact(user, task, contact)
      break

    default:
      return true
  }
  return true
})

export default TaskDispatcher