import {
  createDropdownItem,
  REMINDER_DROPDOWN_OPTIONS,
  REMINDER_SHORTHAND_OPTIONS
} from '../reminder'

describe('utils/visually-hidden/reminder', () => {
  it('should format the reminder times for the dropdown', () => {
    expect(REMINDER_DROPDOWN_OPTIONS).toStrictEqual([
      {
        title: 'None',
        value: -1
      },
      {
        title: 'At the time of event',
        value: 0
      },
      {
        title: '5 Minutes Before',
        value: 300000
      },
      {
        title: '15 Minutes Before',
        value: 900000
      },
      {
        title: '30 Minutes Before',
        value: 1800000
      },
      {
        title: '1 Hour Before',
        value: 3600000
      },
      {
        title: '1 Day Before',
        value: 86400000
      },
      {
        title: '1 Week Before',
        value: 604800000
      }
    ])
  })

  it('should return the shorthandItems grouped, separated by two categories', () => {
    expect(REMINDER_SHORTHAND_OPTIONS).toEqual({
      otherItems: [
        { title: 'At the time of event', value: 0 },
        { title: '5 Minutes Before', value: 300000 },
        { title: '1 Hour Before', value: 3600000 },
        { title: '1 Day Before', value: 86400000 },
        { title: '1 Week Before', value: 604800000 }
      ],
      shortHandItems: [
        { title: 'None', value: -1 },
        { title: '15 Minutes Before', value: 900000 },
        { title: '30 Minutes Before', value: 1800000 }
      ]
    })
  })

  it('should return a dropdown item by passing the timestamp as parameter', () => {
    expect(createDropdownItem(900000)).toStrictEqual({
      title: '15 Minutes Before',
      value: 900000
    })
  })
})
