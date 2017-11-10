import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Avatar from 'react-avatar'
import _ from 'underscore'
import Contact from '../../../../../models/Contact'
import { upsertAttributes } from '../../../../../store_actions/contact'
import Stage from '../components/Stage'
import NoContact from './no-contact'
import Header from './header'

function onChangeStage(stage, contact, upsertAttributes) {
  upsertAttributes(contact.id, 'stage', [{
    id: Contact.get.stage(contact).id,
    type: 'stage',
    stage
  }])
}

function openContact(id) {
  browserHistory.push(`/dashboard/contacts/${id}`)
}

const ContactsList = ({
  contacts,
  user
}) => (
  <div className="list">
    <Header
      user={user}
      contactsCount={_.size(contacts)}
      onNewContact={(id) => openContact(id)}
    />

    <NoContact
      user={user}
      contactsCount={_.size(contacts)}
      onNewContact={(id) => openContact(id)}
    />

    {
      _.size(contacts) > 0 &&
      <table className="table">
        <tbody>
          <tr className="header">
            <td className="col-md-2">NAME</td>
            <td className="col-md-3">EMAIL</td>
            <td className="col-md-2 hidden-xs">PHONE</td>
            <td className="col-md-2 hidden-xs">STAGE</td>
            <td className="col-md-3 hidden-sm hidden-xs">SOURCE</td>
          </tr>
          {
            _.chain(contacts)
              .map(contact => (
                <tr
                  key={`CONTACT_${contact.id}`}
                  onClick={(e) => openContact(contact.id, e)}
                  className="item"
                >
                  <td className="col-md-2">
                    <div className="name">
                      <Avatar
                        className="avatar"
                        round
                        name={Contact.get.name(contact)}
                        src={Contact.get.avatar(contact)}
                        size={35}
                      />
                      <span className="ellipsis">
                        { Contact.get.name(contact) }
                      </span>
                    </div>
                  </td>

                  <td className="col-md-3 ellipsis">
                    { Contact.get.email(contact) }
                  </td>

                  <td className="col-md-2 hidden-xs ellipsis">
                    { Contact.get.phone(contact) }
                  </td>

                  <td
                    className="col-md-2 hidden-xs"
                    onClick={e => e.stopPropagation()}
                  >
                    <Stage
                      default={Contact.get.stage(contact).name}
                      onChange={stage => onChangeStage(stage, contact, upsertAttributes)}
                    />
                  </td>

                  <td className="col-md-3 hidden-sm hidden-xs">
                    { Contact.get.source(contact).label }
                  </td>
                </tr>
              ))
              .value()
          }
        </tbody>
      </table>
    }
  </div>
)

export default connect(({ contacts, user }) => ({
  contacts: contacts.list,
  user
}), { upsertAttributes })(ContactsList)
