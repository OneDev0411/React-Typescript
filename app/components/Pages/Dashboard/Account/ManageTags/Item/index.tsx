import React, { useState, MouseEvent } from 'react'

import { ViewMode } from './ViewMode'
import { EditMode } from './EditMode'
import { Props as BaseProps } from '../Row'

interface Props extends Pick<BaseProps, 'onChange' | 'onDelete'> {
  tag: IContactTag
}

export default function ManageTagsItem(props: Props) {
  const [editAnchorEl, setEditAnchorEl] = useState<Nullable<HTMLElement>>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleShowEdit = (e: MouseEvent<HTMLElement>) => {
    setEditAnchorEl(e.currentTarget)
  }

  const handleCloseEdit = () => {
    setEditAnchorEl(null)
  }

  const handleSave = async (text, touchDate) => {
    if (loading) {
      return
    }

    console.log({ text, touchDate })

    try {
      setLoading(true)

      await props.onChange({
        oldText: props.tag.text,
        newText: text,
        touchDate
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (tag: IContactTag) => {
    setLoading(true)

    await props.onDelete(tag)
    setLoading(false)
  }

  return (
    <>
      <ViewMode
        onEdit={handleShowEdit}
        onDelete={handleDelete}
        tag={props.tag}
        loading={loading}
      />
      <EditMode
        tag={props.tag}
        anchorEl={editAnchorEl}
        loading={loading}
        handleClose={handleCloseEdit}
        onSave={handleSave}
      />
    </>
  )
}
