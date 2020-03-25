import React from 'react'
import fecha from 'fecha'

export default function MLSNote({ mls, mlsName }) {
  if (!mlsName && !mls) {
    return null
  }

  const today = new Date()

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
            {` Copyright © ${mls} ${today.getFullYear()}. All rights reserved. Last updated at ${fecha.format(
              today,
              'mediumDate'
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
