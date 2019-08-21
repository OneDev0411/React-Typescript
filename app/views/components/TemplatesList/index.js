import React, { useState, useContext } from 'react'
import Masonry from 'react-masonry-css'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { TemplatesListContainer, TemplatesContainer } from './styled'
import Item from './Item'
import Title from './Title'
import Fallback from './Fallback'
import TemplateAction from './TemplateAction'
import PreviewModal from './PreviewModal'

function TemplatesList(props) {
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isActionTriggered, setActionTriggered] = useState(false)
  const [isEditActionTriggered, setEditActionTriggered] = useState(false)
  const modal = useContext(ConfirmationModalContext)
  const handleDelete = props.onDelete
    ? ({ template, onFailed, onCancel }) => {
        modal.setConfirmationModal({
          message: 'Delete your design?',
          description: 'Once deleted you would not be able to recover it.',
          confirmLabel: 'Delete',
          appearance: 'danger',
          onConfirm: () => {
            props.onDelete(template.id).catch(onFailed)
          },
          onCancel
        })
      }
    : undefined

  const isEmpty = props.items.length == 0

  if (props.isLoading || isEmpty) {
    return <Fallback isEmpty={isEmpty} isLoading={props.isLoading} />
  }

  return (
    <TemplatesContainer>
      {props.titleRenderer ? (
        props.titleRenderer()
      ) : (
        <Title count={props.items.length} />
      )}

      <TemplatesListContainer>
        <Masonry
          breakpointCols={{
            default: 5,
            1600: 4,
            1200: 3,
            960: 2,
            568: 1
          }}
          className="templates-masonry-grid"
          columnClassName={`templates-masonry-grid_column ${
            props.type === 'history' ? 'is-instance' : ''
          }`}
        >
          {props.items.map(template => (
            <Item
              key={template.id}
              template={template}
              handlePreview={selectedTemplate => {
                setPreviewModalOpen(true)
                setSelectedTemplate(selectedTemplate)
              }}
              handleCustomize={selectedTemplate => {
                setActionTriggered(true)
                setEditActionTriggered(false)
                setSelectedTemplate(selectedTemplate)
              }}
              handleDelete={handleDelete}
              handleEdit={selectedTemplate => {
                setActionTriggered(true)
                setEditActionTriggered(true)
                setSelectedTemplate(selectedTemplate)
              }}
            />
          ))}
        </Masonry>
      </TemplatesListContainer>

      <PreviewModal
        type={props.type}
        medium={props.medium}
        isPreviewModalOpen={isPreviewModalOpen}
        selectedTemplate={selectedTemplate}
        templates={props.items}
        setActionTriggered={setActionTriggered}
        setPreviewModalOpen={setPreviewModalOpen}
        setSelectedTemplate={setSelectedTemplate}
      />

      <TemplateAction
        type={props.type}
        medium={props.medium}
        isEdit={isEditActionTriggered}
        isTriggered={isActionTriggered}
        setTriggered={setActionTriggered}
        setEditActionTriggered={setEditActionTriggered}
        selectedTemplate={selectedTemplate}
      />
    </TemplatesContainer>
  )
}

export default TemplatesList
