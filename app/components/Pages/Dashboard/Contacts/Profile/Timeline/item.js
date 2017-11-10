import React from 'react'
import Avatar from 'react-avatar'

export default({
  attributes,
  name,
  avatar
}) => {
  const activity = (
    <div className="event">
      <div className="image">
        {
          attributes.image ?
            <img src={attributes.image} /> :
            <Avatar
              round
              name={name}
              src={avatar}
              size={34}
            />
        }
      </div>

      <div className="info">
        <div
          className="desc"
          dangerouslySetInnerHTML={{ __html: attributes.title }}
        />

        <div className="time">
          <img src={`/static/images/contacts/${attributes.icon}@3x.png`} />
          { attributes.time }
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {
        attributes.url ?
          <a href={attributes.url} target="_blank">{ activity }</a> :
          activity
      }
    </div>
  )
}
