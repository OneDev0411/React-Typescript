import React from 'react'
import fecha from 'fecha'

export default function MLSNote({ mls, mlsName }) {
  if (!mlsName && !mls) {
    return null
  }

  const lastUpdateDate = getLastUpdateDate()

  return (
    <div style={{ maxWidth: '60em', marginTop: '2em', color: '#aaa' }}>
      <p>
        {mlsName && (
          <span>{`Listing information provided in part by the ${mlsName}, for personal, non-commercial use by viewers of
        this site and may not be reproduced or redistributed. All information is
        deemed reliable but not guaranteed.`}</span>
        )}
        {mls && (
          <span>
            {` Copyright © ${mls} ${lastUpdateDate.getFullYear()}. All rights reserved. Last updated at ${fecha.format(
              lastUpdateDate,
              'MMM DD, YYYY hh:mm A'
            )}.`}
          </span>
        )}
      </p>

      {mlsName && (
        <p>{`The data relating to real estate for sale on this website appears in part through the ${mlsName} Internet Data Exchange program, a voluntary cooperative exchange of property listing data between licensed real estate brokerage firms in which participates, and is provided by ${mlsName} through a licensing agreement.`}</p>
      )}

      <p>
        Some properties which appear for sale on this website may no longer be
        available because they are under contract, have Closed or are no longer
        being offered for sale.
      </p>
    </div>
  )
}

// Rounds the timestamp to the nearest 15 minute.
// For example we show 7:15 if it's 7:19, and 7:45 if it's 7:58
function getLastUpdateDate() {
  const date = new Date()
  const minutes = date.getMinutes()

  date.setMinutes(minutes - (minutes % 15))

  return date
}
