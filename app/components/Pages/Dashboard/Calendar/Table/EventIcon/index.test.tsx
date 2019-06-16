import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

// Deal Context Icons
import IconTaskCritical from 'components/SvgIcons/TaskCritical/IconTaskCritical'

// Contact Dates (Important Dates) Icons
import IconBirthday from 'components/SvgIcons/Birthday/IconBirthday'

// CRM Tasks Icons
import IconCall from 'components/SvgIcons/CallOutline/IconCallOutline'
import IconText from 'components/SvgIcons/Text/IconText'
import IconChat from 'components/SvgIcons/Chat/IconChat'
import IconEmail from 'components/SvgIcons/EmailOutline/IconEmailOutline'
import IconMail from 'components/SvgIcons/Mail/IconMail'
import IconOther from 'components/SvgIcons/MenuRounded/IconMenuRounded'
import IconInPerson from 'components/SvgIcons/InPerson/IconInPerson'

// Deal Context Fixtures
import dealContext from 'fixtures/calendar/events/deal-context.json'

// CRM Tasks Fixtures
import call from 'fixtures/calendar/events/call.json'
import inPersonMeeting from 'fixtures/calendar/events/in-person-meeting.json'
import text from 'fixtures/calendar/events/text.json'
import chat from 'fixtures/calendar/events/chat.json'
import mail from 'fixtures/calendar/events/mail.json'
import email from 'fixtures/calendar/events/email.json'
import other from 'fixtures/calendar/events/other.json'

// Contact Dates (Important Dates) Fixtures
import birthday from 'fixtures/calendar/events/birthday.json'
import spouseBitrhday from 'fixtures/calendar/events/spouse-birthday.json'
import childBitrhday from 'fixtures/calendar/events/child-birthday.json'

import EventIcon from '.'

// TODO: Clean up icons and remove unused redundant ones
// and add all needed icons to this table
const EVENT_ICON_TABLE = [
  // Critical Dates
  {
    event: dealContext,
    icon: IconTaskCritical
  },
  // CRM Tasks
  {
    event: call,
    icon: IconCall
  },
  {
    event: inPersonMeeting,
    icon: IconInPerson
  },
  {
    event: text,
    icon: IconText
  },
  {
    event: chat,
    icon: IconChat
  },
  {
    event: mail,
    icon: IconMail
  },
  {
    event: email,
    icon: IconEmail
  },
  {
    event: other,
    icon: IconOther
  },
  // Contact Dates (Important Dates)
  {
    event: birthday,
    icon: IconBirthday
  },
  {
    event: spouseBitrhday,
    icon: IconBirthday
  },
  {
    event: childBitrhday,
    icon: IconBirthday
  }
]

describe('EventIcon component', () => {
  EVENT_ICON_TABLE.forEach(({ event, icon }) => {
    const wrapper = shallow(<EventIcon event={event} />)

    it(`renders ${event.type_label}`, () => {
      expect(toJson(wrapper)).toMatchSnapshot()
    })

    it(`renders proper icon for ${event.type_label}`, () => {
      expect(wrapper.find(icon)).toHaveLength(1)
    })
  })
})
