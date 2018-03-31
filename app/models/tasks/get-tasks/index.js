import Fetch from '../../../services/fetch'

/*
  URI Parameters (All of them are optional.)

  q string (optional)
    - String search in title and description
    - Example: Hello World

  assignee string (optional)

  contact string (optional)
    - Example: 0b906159-ae2d-46d0-96b9-46877b36d129

  deal string (optional)

  listing string (optional)

  due_gte number (optional)
    - Due date greater than or equal to

  due_lte number (optional)
    - Due date less than or equal to

  status string (optional)
    - Members: PENDING, DONE

  task_type string (optional)
    - Members: Call, Message, Todo

  start number (optional)

  limit number (optional)
    - Default: 10
    - Example: 10

  order string (optional)
    - Put a minus sign before field name for descending order
    - Members: due_date, created_at, updated_at
    - Example: -due_date

  associations string (required)
    - Example: crm_task.associations
*/

export async function getTasks(query = {}) {
  try {
    const response = await new Fetch().get('/crm/tasks').query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
