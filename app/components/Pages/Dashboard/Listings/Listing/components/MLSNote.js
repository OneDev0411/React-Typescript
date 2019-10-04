import React from 'react'
import fecha from 'fecha'

export default function MLSNote({ mls, mlsName }) {
  if (!mlsName && !mls) {
    return null
  }

  const today = new Date()

  return (
    <div style={{ maxWidth: '60em', marginTop: '2em', color: '#aaa' }}>
      <div>
        {`Listing information provided in part by the ${mlsName}, for personal, non-commercial use by viewers of
        this site and may not be reproduced or redistributed. All information is
        deemed reliable but not guaranteed.`}
      </div>
      <div>
        {`Copyright © ${mls} ${today.getFullYear()}. All rights reserved. Last updated at ${fecha.format(
          today,
          'mediumDate'
        )}.`}
      </div>
    </div>
  )
}
