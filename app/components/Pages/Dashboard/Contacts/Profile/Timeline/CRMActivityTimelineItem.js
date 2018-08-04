import React from 'react'
import Avatar from 'react-avatar'

export function CRMActivityTimelineItem(props) {
  const { attributes } = props
  const activity = (
    <React.Fragment>
      <div className="image">
        {attributes.image ? (
          <img src={attributes.image} alt="activity" />
        ) : (
          <Avatar round name={props.name} src={props.avatar} size={34} />
        )}
      </div>

      <div style={{ overflow: ' hidden' }}>
        <div
          className="desc"
          dangerouslySetInnerHTML={{ __html: attributes.title }}
        />

        <div className="time">
          <img
            src={`/static/images/contacts/${attributes.icon}@3x.png`}
            alt="time"
          />
          {attributes.time}
        </div>
      </div>
    </React.Fragment>
  )

  return (
    <div className="c-contact-activities-list__item">
      {attributes.url ? (
        <a href={attributes.url} target="_blank">
          {activity}
        </a>
      ) : (
        activity
      )}
    </div>
  )
}
