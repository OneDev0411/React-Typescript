import React from 'react'
import { Button } from '@material-ui/core'

import Link from 'components/ALink'

interface Props {
  title: string
  url: string
}

export default function LinkSectionAction({ title, url }: Props) {
  return (
    <Link noStyle to={url}>
      <Button variant="text" color="secondary">
        {title}
      </Button>
    </Link>
  )
}
