import { addressTitle } from 'utils/listing'
import {
  normalizeListing,
  normalizeAssociations
} from 'views/utils/association-normalizers'
import {
  getReminderItem,
  createDropdownItem,
  ReminderDropdownItem
} from 'views/utils/reminder'

const fallbackReminder = createDropdownItem(3600000)
const normalizeServerDate = (date: number) => date * 1000

const makeReminder = (
  reminders: Nullable<ICRMTaskReminder[]>,
  dueDate: number
): ReminderDropdownItem => {
  const lastReminder = [...(reminders ?? [])].pop()

  if (lastReminder) {
    return getReminderItem(dueDate, normalizeServerDate(lastReminder.timestamp))
  }

  return fallbackReminder
}

interface MakeDefaultTaskProperties {
  owner: IUser
  listing: Nullable<IListing>
  location: Partial<ICRMTaskAssociation<'listing'>>
}

const makeDefaultTask = ({
  owner,
  listing,
  location
}: MakeDefaultTaskProperties) => ({
  assignees: [owner],
  registrants: [],
  endDate: null,
  dueDate: new Date(),
  location,
  reminder: fallbackReminder,
  title: listing?.property?.address
    ? addressTitle(listing.property.address)
    : ''
})

interface PostLoadFormat
  extends Pick<ICRMTask<'assignees'>, 'assignees'>,
    Partial<ICRMTask<'reminders' | 'associations', 'contact' | 'listing'>> {
  endDate: Nullable<Date>
  dueDate: Date
  location: Partial<ICRMTaskAssociation<'listing'>>
  registrants: ICRMTaskAssociation<'contact'>[]
  reminder: ReminderDropdownItem
}

/**
 * Format form data for api model
 * @param {object} task The Task entity
 * @param {object} owner logged in user
 * @param {object} listing The open house listing
 * @returns {Promise} a formated Task
 */
export async function postLoadFormat(
  task: Nullable<
    ICRMTask<'assignees' | 'reminders' | 'associations', 'contact' | 'listing'>
  >,
  owner: IUser,
  listing: Nullable<IListing>
): Promise<PostLoadFormat> {
  let location: Partial<ICRMTaskAssociation<'listing'>> = {
    association_type: 'listing',
    index: 1,
    listing: normalizeListing(listing)
  }

  if (!task) {
    return makeDefaultTask({ owner, listing, location })
  }

  const { associations, assignees, reminders, end_date } = task
  const dueDate = normalizeServerDate(task.due_date)
  const endDate = end_date ? new Date(normalizeServerDate(end_date)) : null
  const reminder = makeReminder(reminders, dueDate)
  const registrants: ICRMTaskAssociation<'contact'>[] = []

  if (Array.isArray(associations)) {
    const normalizedAssociations: ICRMTaskAssociation<'listing' | 'contact'>[] =
      normalizeAssociations(associations)

    normalizedAssociations.forEach(association => {
      const { association_type: type } = association

      if (type === 'contact') {
        registrants.push(association)
      } else if (type === 'listing') {
        location = association
      }
    })
  }

  return {
    ...task,
    assignees: !Array.isArray(assignees) ? [] : assignees,
    endDate,
    dueDate: new Date(dueDate),
    location,
    registrants,
    reminder
  }
}
