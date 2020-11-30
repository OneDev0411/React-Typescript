import React from 'react'
import { Link } from 'react-router'

export const Address = ({ listing }) => (
  <Link to={`/dashboard/mls/${listing.id}`}>{listing.addressTitle}</Link>
)
