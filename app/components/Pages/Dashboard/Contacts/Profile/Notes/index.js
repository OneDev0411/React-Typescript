import React from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import timeago from 'timeago.js'
import {
  deleteAttributes,
  upsertContactAttributes
} from '../../../../../../store_actions/contacts'
import Textarea from '../../components/Textarea'

const Notes = ({ notes, handelOnDelete, upsertAttribute, actionStatus }) => (
  <div>
    {notes.length === 0 ? (
      <div className="empty-list">
        <img alt="notepad" src="/static/images/contacts/notepad-edit-231.svg" />
        <p>There are no notes yet</p>
      </div>
    ) : (
      notes.map(note => (
        <div
          key={`note_${note.id}`}
          className={cn('c-notes-timeline', {
            disabled: actionStatus && actionStatus.item === note.id
          })}
        >
          <Textarea
            isEditable
            item={note}
            onSubmit={upsertAttribute}
            onDelete={handelOnDelete}
            disabled={actionStatus}
          />
          <div className="c-notes-timeline__time">
            <i className="fa fa-clock-o" />
            <span>{timeago().format(note.created_at * 1000)}</span>
          </div>
          {actionStatus &&
            actionStatus.item === note.id && (
              <div className="c-notes-timeline__loading">
                <i className="fa fa-spin fa-spinner" />
                {actionStatus.status}
              </div>
            )}
        </div>
      ))
    )}
  </div>
)

function mapStateToProps(state, props) {
  const { contact } = props
  const { id: contactId } = contact

  return { contactId }
}

const enhance = compose(
  connect(
    mapStateToProps,
    {
      deleteAttributes,
      upsertContactAttributes
    }
  ),
  withState('actionStatus', 'setActionStatus', null),
  withHandlers({
    upsertAttribute: ({
      contactId,
      setActionStatus,
      upsertContactAttributes
    }) => async attributes => {
      setActionStatus({ status: 'Saving ...', item: attributes[0].id })

      try {
        await upsertContactAttributes(contactId, attributes)
      } catch (error) {
        throw error
      } finally {
        setActionStatus(null)
      }
    }
  }),
  withHandlers({
    handelOnDelete: ({
      contactId,
      setActionStatus,
      deleteAttributes
    }) => async note => {
      setActionStatus({ status: 'Deleting ...', item: note.id })

      try {
        await deleteAttributes(contactId, [note.id])
      } catch (error) {
        throw error
      } finally {
        setActionStatus(null)
      }
    }
  })
)

export default enhance(Notes)
