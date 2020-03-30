import React, { useContext, useState } from 'react'
import { addNotification as notify } from 'reapop'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'
import chunk from 'lodash/chunk'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { isTemplateInstance } from 'utils/marketing-center/helpers'

import { TemplatesListContainer } from './styled'
import MarketingTemplateCard from '../MarketingTemplateCard'
import Fallback from './Fallback'
import TemplateAction from './TemplateAction'
import MarketingTemplatePreviewModal from '../MarketingTemplatePreviewModal'
import { MarketingTemplateMasonry } from '../MarketingTemplateMasonry'
import { TemplateCardActions } from './TemplateCardActions'
import { TemplateInstanceCardActions } from './TemplateInstanceCardActions'

function TemplatesList(props) {
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isActionTriggered, setActionTriggered] = useState(false)
  const [isEditActionTriggered, setEditActionTriggered] = useState(false)
  const modal = useContext(ConfirmationModalContext)
  const handleDelete = props.onDelete
    ? template => {
        modal.setConfirmationModal({
          message: 'Delete your design?',
          description: 'Once deleted you would not be able to recover it.',
          confirmLabel: 'Delete',
          appearance: 'danger',
          onConfirm: () => {
            props.onDelete(template.id).catch(() => {
              props.notify({
                title:
                  'There is a problem for deleting the template. Please try again.',
                status: 'error',
                dismissible: true
              })
            })
          }
        })
      }
    : undefined

  const isEmpty = props.items.length == 0

  if (props.isLoading || isEmpty) {
    return (
      <Fallback
        isEmpty={isEmpty}
        isLoading={props.isLoading}
        component={props.emptyState}
      />
    )
  }

  const pages = props.pageSize
    ? chunk(props.items, props.pageSize)
    : [props.items]

  return (
    <div>
      <TemplatesListContainer>
        {pages.map((items, index) => (
          <MarketingTemplateMasonry
            key={index}
            breakpointCols={{
              default: 5,
              1600: 4,
              1200: 3,
              960: 2,
              568: 1
            }}
          >
            {items.map(template => (
              <MarketingTemplateCard
                key={template.id}
                template={template}
                handlePreview={() => {
                  setPreviewModalOpen(true)
                  setSelectedTemplate(template)
                }}
                actions={
                  isTemplateInstance(template) ? (
                    <TemplateInstanceCardActions
                      handleDelete={() => handleDelete(template)}
                      handleEdit={() => {
                        setActionTriggered(true)
                        setEditActionTriggered(true)
                        setSelectedTemplate(template)
                      }}
                    />
                  ) : (
                    <TemplateCardActions
                      handleCustomize={() => {
                        setActionTriggered(true)
                        setEditActionTriggered(false)
                        setSelectedTemplate(template)
                      }}
                    />
                  )
                }
              />
            ))}
          </MarketingTemplateMasonry>
        ))}
      </TemplatesListContainer>

      <MarketingTemplatePreviewModal
        type={props.type}
        medium={props.medium}
        isOpen={isPreviewModalOpen}
        selectedTemplate={selectedTemplate}
        templates={props.items}
        actions={
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setPreviewModalOpen(false)
              setActionTriggered(true)

              if (isTemplateInstance(selectedTemplate)) {
                setEditActionTriggered(true)
              }
            }}
          >
            {selectedTemplate && isTemplateInstance(selectedTemplate)
              ? 'Continue'
              : 'Customize'}
          </Button>
        }
        onClose={() => setPreviewModalOpen(false)}
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
    </div>
  )
}

export default connect(
  null,
  { notify }
)(TemplatesList)
