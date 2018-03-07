import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import Timeline from '../Timeline'
import Notes from '../Notes'
import Contact from '../../../../../../models/contacts'

export default ({ contact, activeTab, onChangeTab }) => {
  const notes = Contact.get.notes(contact)

  return (
    <div className="c-contact-profile-card activities">
      <Tabs
        activeKey={activeTab}
        animation={false}
        id="tabs"
        onSelect={activeTab => onChangeTab(activeTab)}
      >
        <Tab
          eventKey="timeline"
          title={
            <div>
              <span className="name">All Activity</span>
            </div>
          }
          className="timeline"
        >
          <Timeline
            name={Contact.get.name(contact)}
            avatar={Contact.get.avatar(contact)}
            activities={contact.activities || {}}
          />
        </Tab>

        <Tab
          eventKey="notes"
          title={
            <div>
              <span className="name">Notes</span>
              <span className="bdg">{`( ${notes.length} )`}</span>
            </div>
          }
          className="notes"
        >
          <Notes notes={notes} contact={contact} />
        </Tab>
      </Tabs>
    </div>
  )
}
