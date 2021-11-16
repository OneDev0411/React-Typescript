import { useContext, useState, useEffect } from 'react'

import { Button } from '@material-ui/core'
import { connect } from 'react-redux'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { addNotification as notify } from 'components/notification'
import { isTemplateInstance } from 'utils/marketing-center/helpers'

import BrandAssetCard from '../BrandAssetCard'
import MarketingTemplateCard from '../MarketingTemplateCard'
import { MarketingTemplateMasonry } from '../MarketingTemplateMasonry'
import MarketingTemplatePreviewModal from '../MarketingTemplatePreviewModal'

import Fallback from './Fallback'
import { TemplatesListContainer } from './styled'
import TemplateAction from './TemplateAction'
import TemplateCardActions from './TemplateCardActions'

function TemplatesList(props) {
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isActionTriggered, setActionTriggered] = useState(false)
  const [isEditActionTriggered, setEditActionTriggered] = useState(false)
  const modal = useContext(ConfirmationModalContext)

  useEffect(() => {
    if (!props.defaultSelected || !props.items || props.items.length === 0) {
      return
    }

    const defaultSelectedTemplate = props.items.find(
      item => item.template.id === props.defaultSelected
    )

    if (!defaultSelectedTemplate) {
      return
    }

    setSelectedTemplate(defaultSelectedTemplate)
    setPreviewModalOpen(true)
  }, [props.defaultSelected, props.items])

  const notifyDeleteError = () => {
    props.notify({
      title: 'Error deleting template. Please try again or contact support.',
      status: 'error'
    })
  }

  const handleDeleteInstance = props.onDeleteInstance
    ? template => {
        modal.setConfirmationModal({
          message: 'Delete your design?',
          description: 'Once deleted you would not be able to recover it.',
          confirmLabel: 'Delete',
          appearance: 'danger',
          onConfirm: () => {
            try {
              props.onDeleteInstance(template.id)
            } catch (e) {
              console.error(e)
              notifyDeleteError()
            }
          }
        })
      }
    : undefined

  const handleDeleteBrandTemplate = template => {
    modal.setConfirmationModal({
      message: 'Delete this template?',
      description:
        'Once deleted you and your team members would not be able to recover it.',
      confirmLabel: 'Delete',
      appearance: 'danger',
      onConfirm: async () => {
        try {
          props.onDelete(template)
        } catch (e) {
          console.error(e)
          notifyDeleteError()
        }
      }
    })
  }

  const isEmpty = props.items.length === 0 && !props.isLoading

  if (props.isLoading || isEmpty) {
    return (
      <Fallback
        isEmpty={isEmpty}
        isLoading={props.isLoading}
        component={props.emptyState}
      />
    )
  }

  return (
    <div>
      <TemplatesListContainer>
        <MarketingTemplateMasonry
          breakpointCols={{
            default: 5,
            1600: 4,
            1200: 3,
            960: 2,
            568: 1
          }}
        >
          {props.items.map(item => {
            if (item.type === 'brand_asset') {
              return <BrandAssetCard key={item.id} asset={item} />
            }

            return (
              <MarketingTemplateCard
                key={item.id}
                template={item}
                handlePreview={() => {
                  setPreviewModalOpen(true)
                  setSelectedTemplate(item)
                  props.onSelect && props.onSelect(item)
                }}
                actions={
                  isTemplateInstance(item) ? (
                    <TemplateCardActions
                      editButtonText="Continue"
                      handleDelete={() => handleDeleteInstance(item)}
                      handleEdit={() => {
                        setActionTriggered(true)
                        setEditActionTriggered(true)
                        setSelectedTemplate(item)
                      }}
                    />
                  ) : (
                    <TemplateCardActions
                      handleDelete={
                        props.onDelete
                          ? () => handleDeleteBrandTemplate(item)
                          : undefined
                      }
                      handleEdit={() => {
                        setActionTriggered(true)
                        setEditActionTriggered(false)
                        setSelectedTemplate(item)
                        props.onSelect && props.onSelect(item)
                      }}
                    />
                  )
                }
              />
            )
          })}
        </MarketingTemplateMasonry>
      </TemplatesListContainer>

      <MarketingTemplatePreviewModal
        type={props.type}
        medium={props.medium}
        isOpen={isPreviewModalOpen && !isActionTriggered}
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
        onClose={() => {
          setPreviewModalOpen(false)
          props.onSelect && props.onSelect(null)
        }}
        setSelectedTemplate={template => {
          setSelectedTemplate(template)
          props.onSelect && props.onSelect(template)
        }}
      />

      <TemplateAction
        type={props.type}
        medium={props.medium}
        isEdit={isEditActionTriggered}
        isTriggered={isActionTriggered}
        setTriggered={value => {
          setActionTriggered(value)

          setPreviewModalOpen(false)
          props.onSelect && props.onSelect(null)
        }}
        setEditActionTriggered={setEditActionTriggered}
        selectedTemplate={selectedTemplate}
      />
    </div>
  )
}

export default connect(null, { notify })(TemplatesList)
