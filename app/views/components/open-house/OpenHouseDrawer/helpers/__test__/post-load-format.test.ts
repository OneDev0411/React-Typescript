import MockDate from 'mockdate'

import createMockListing from '../__mocks__/createListing'
import createMockOwner from '../__mocks__/createOwner'
import createMockTask from '../__mocks__/createTask'
import { postLoadFormat as format } from '../post-load-format'

import getPostFormatTaskExpectation from './post-format-task-expectation'

describe('open-house/OpenHouseDrawer/helpers', () => {
  let listing: Nullable<ReturnType<typeof createMockListing>>
  let owner: ReturnType<typeof createMockOwner>
  let task: Nullable<
    ICRMTask<'assignees' | 'reminders' | 'associations', 'contact' | 'listing'>
  >

  beforeEach(() => {
    MockDate.set(new Date('2023-03-19T11:00:00.000Z'))
  })

  afterEach(() => {
    MockDate.reset()
  })

  describe('when no listing was provided', () => {
    beforeEach(() => {
      listing = null
      owner = createMockOwner()
      task = null
    })

    it('should return with the fallback settings and the default task', async () => {
      expect(await format(task, owner, listing)).toStrictEqual({
        assignees: [owner],
        registrants: [],
        endDate: null,
        dueDate: new Date(),
        location: {
          association_type: 'listing',
          index: 1,
          listing: null
        },
        reminder: { title: '1 Hour Before', value: 3600000 },
        title: ''
      })
    })
  })

  describe('when no task was provided', () => {
    beforeEach(() => {
      listing = createMockListing()
      owner = createMockOwner()
      task = null
    })

    it('should return the default task', async () => {
      expect(await format(task, owner, listing)).toStrictEqual({
        assignees: [owner],
        dueDate: new Date('2023-03-19T11:00:00.000Z'),
        endDate: null,
        location: {
          association_type: 'listing',
          index: 1,
          listing: {
            avatar: {
              isOnline: true,
              placeHolderImage: '/static/icons/listing-place-holder.svg',
              statusColor: '#32b86d',
              url: 'https://cdn.rechat.com/fd6a44e9e00d0342e4261ffdcfa522db.jpg'
            },
            location: {
              latitude: 34.07333,
              longitude: -118.428287,
              type: 'location'
            },
            details: 'Active,\n    $165,000,000',
            id: 'f69ff932-8b6e-11ec-b50c-0aa41e28002f',
            original: listing,
            type: 'listing',
            title: '594 MAPLETON DR',
            url: '/dashboard/mls/f69ff932-8b6e-11ec-b50c-0aa41e28002f'
          }
        },
        registrants: [],
        title: '594 S MAPLETON DR',
        reminder: { title: '1 Hour Before', value: 3600000 }
      })
    })
  })

  describe('when an open house is defined', () => {
    describe('when the task has no contact associations, registrants should be emptry', () => {
      beforeEach(() => {
        listing = createMockListing()
        owner = createMockOwner()
        task = createMockTask({ withContacts: false })
      })

      it('should return the fully featured task', async () => {
        expect(await format(task, owner, listing)).toStrictEqual(
          getPostFormatTaskExpectation({ listing, withRegistrants: false })
        )
      })
    })

    describe('when the task has contact associations, should return as registrants', () => {
      beforeEach(() => {
        listing = createMockListing()
        owner = createMockOwner()
        task = createMockTask()
      })

      it('should return the fully featured task', async () => {
        expect(await format(task, owner, listing)).toStrictEqual(
          getPostFormatTaskExpectation({ listing })
        )
      })
    })

    describe('when the task has no assignee', () => {
      beforeEach(() => {
        listing = createMockListing()
        owner = createMockOwner()
        task = createMockTask({ withAssignees: false })
      })

      it('should return the fully featured task', async () => {
        expect(await format(task, owner, listing)).toStrictEqual(
          getPostFormatTaskExpectation({ listing, withAssignees: false })
        )
      })
    })

    describe('when the task has reminders', () => {
      beforeEach(() => {
        listing = createMockListing()
        owner = createMockOwner()
        task = createMockTask({ withReminders: true })
      })

      it('should return the fully featured task', async () => {
        expect(await format(task, owner, listing)).toStrictEqual(
          getPostFormatTaskExpectation({ listing, withReminders: true })
        )
      })
    })
  })
})
