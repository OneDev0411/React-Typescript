import React, { useState } from 'react'

// import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'

import { ViewMode } from './ViewMode'
// import { EditMode } from './EditMode'

interface Props {
  tag: IContactTag
  onDelete: (tag: IContactTag) => void
}

export default function ManageTagsItem(props: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [text, setText] = useState<string>(props.tag.text)

  // const toggleEditing = () => setIsEditing(!isEditing)

  // const onChange = text => setText(text)

  // const handleCancel = () => {
  //   setIsEditing(false)
  //   setText(props.tag.text)
  // }

  // const handleSave = async () => {
  //   if (loading) {
  //     return
  //   }

  //   if (text === props.tag.text) {
  //     return setIsEditing(false)
  //   }

  //   try {
  //     setLoading(true)

  //     const done = await props.onChange({
  //       oldText: props.tag.text,
  //       newText: text
  //     })

  //     setLoading(false)

  //     if (done) {
  //       setIsEditing(false)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     setIsEditing(false)
  //   }
  // }

  const handleDelete = async (tag: IContactTag) => {
    setLoading(true)

    await props.onDelete(tag)
    setLoading(false)
  }

  // const renderEditMode = props => (
  //   <EditMode value={text} onChange={onChange} loading={loading} {...props} />
  // )

  // const renderViewMode = () => (
  //   <ViewMode onDelete={handleDelete} tag={props.tag} loading={loading} />
  // )

  return <ViewMode onDelete={handleDelete} tag={props.tag} loading={loading} />

  // return (
  //   <InlineEditableField
  //     cancelOnOutsideClick
  //     handleCancel={handleCancel}
  //     handleSave={handleSave}
  //     handleDelete={handleDelete}
  //     isDisabled={loading}
  //     isEditing={isEditing}
  //     renderEditMode={renderEditMode}
  //     renderViewMode={renderViewMode}
  //     showEdit={false}
  //     showDelete={false}
  //     style={{ margin: '0 0.3rem' }}
  //     toggleMode={toggleEditing}
  //   />
  // )
}
