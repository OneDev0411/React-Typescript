import { useState, MouseEvent } from 'react'

import { Props as BaseProps } from '../Row'

import { EditMode } from './EditMode'
import { ViewMode } from './ViewMode'

interface Props extends Pick<BaseProps, 'onChange' | 'onDelete'> {
  tag: IContactTag & { highlight: boolean }
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

  const handleSave = async (
    text: string,
    touchDate: Nullable<number>
  ): Promise<void> => {
    handleCloseEdit()

    if (loading) {
      return
    }

    try {
      setLoading(true)

      await props.onChange({
        oldText: props.tag.text,
        newText: text,
        touchDate: touchDate !== 0 ? touchDate : null
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (tag: IContactTag): Promise<void> => {
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
