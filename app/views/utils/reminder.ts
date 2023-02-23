import fecha from 'fecha'

const NONE_OPTION = { title: 'None', value: -1 }

const REMINDER_ITEMS = {
  0: 'At the time of event',
  300000: '5 Minutes Before',
  900000: '15 Minutes Before',
  1800000: '30 Minutes Before',
  3600000: '1 Hour Before',
  86400000: '1 Day Before',
  604800000: '1 Week Before'
} as const

export type ReminderDropdownItem = {
  title: string
  value: number
}

type DropdownValues = keyof typeof REMINDER_ITEMS

export const createDropdownItem = (
  value: DropdownValues
): ReminderDropdownItem => ({
  title: REMINDER_ITEMS[value],
  value
})

const getReminderReminderDropdownItems = (): ReminderDropdownItem[] => {
  const items = [NONE_OPTION]

  Object.keys(REMINDER_ITEMS).forEach(value => {
    items.push(createDropdownItem(parseInt(value, 10) as DropdownValues))
  })

  return items
}

export const REMINDER_DROPDOWN_OPTIONS = getReminderReminderDropdownItems()

interface GetShorthandReminderItems {
  shortHandItems: ReminderDropdownItem[]
  otherItems: ReminderDropdownItem[]
}

const isShorthandItem = (item: ReminderDropdownItem): boolean =>
  (item.value >= 900_000 && item.value <= 1_800_000) || item.value === -1

const getShorthandReminderItems = (): GetShorthandReminderItems => {
  const shortHandItems = REMINDER_DROPDOWN_OPTIONS.filter(isShorthandItem)
  const otherItems = REMINDER_DROPDOWN_OPTIONS.filter(
    item => !isShorthandItem(item)
  )

  return { shortHandItems, otherItems }
}

export const REMINDER_SHORTHAND_OPTIONS = getShorthandReminderItems()

/**
 *
 * @param {Number} dueDate Timestamp in ms
 * @param {Number} reminderDate Timestamp in ms
 *
 * @return {String} The reminder label
 */
export function getReminderLabel(
  dueDate: number,
  reminderDate: number
): string {
  const timeDifference = dueDate - reminderDate

  return REMINDER_ITEMS[timeDifference] || 'None'
}

/**
 *
 * @param {Number} dueDate Timestamp in ms
 * @param {Number} reminderDate Timestamp in ms
 *
 * @return {Object} A title-value object
 */
export function getReminderItem(
  dueDate: number,
  reminderDate: number
): ReminderDropdownItem {
  // timeDifference
  const value = dueDate - reminderDate
  const title = REMINDER_ITEMS[value]

  return title
    ? { title, value }
    : { title: fecha.format(reminderDate, 'MMM D, YYYY hh:mm A'), value }
}

/**
 *
 * @param {Number} timeDifference The time difference in ms
 * @param {Date} dueDate The reminder due date-time
 *
 * @return {Date} The reminder date-time
 */

export function getReminder(
  timeDifference: number,
  dueDate = new Date()
): Date {
  const dueDateTimestamp = dueDate.getTime()

  return new Date(dueDateTimestamp - timeDifference)
}
