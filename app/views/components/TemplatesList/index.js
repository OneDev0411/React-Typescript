import { useContext, useState, useEffect } from 'react'

import { Tooltip, Button, makeStyles } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'
import { connect } from 'react-redux'

import { useInfinitePagination } from '@app/hooks/use-infinite-pagination'
import {
  isBrandAsset,
  isBrandTemplate,
  isTemplateInstance
} from '@app/utils/marketing-center/helpers'
import BrandAssetCard from '@app/views/components/BrandAssetCard'
import IconButton from '@app/views/components/Button/IconButton'
import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'
import MarketingTemplateCard from '@app/views/components/MarketingTemplateCard'
import { MarketingTemplateMasonry } from '@app/views/components/MarketingTemplateMasonry'
import MarketingTemplatePreviewModal from '@app/views/components/MarketingTemplatePreviewModal'
import { addNotification as notify } from '@app/views/components/notification'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import Fallback from './Fallback'
import { TemplatesListContainer } from './styled'
import TemplateAction from './TemplateAction'
import TemplateCardActions from './TemplateCardActions'

const useStyles = makeStyles(
  theme => ({
    iconButton: {
      padding: `${theme.spacing(0, 1)} !important`,
      backgroundColor: 'rgba(0, 0, 0, 0.55) !important',

      '& svg': {
        color: `${theme.palette.common.white} !important`
      },

      '&:hover': {
        background: theme.palette.common.black
      }
    }
  }),
  {
    name: 'MarketingTemplatesList'
  }
)

function TemplatesList(props) {
  const classes = useStyles()
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isActionTriggered, setActionTriggered] = useState(false)
  const [isEditActionTriggered, setEditActionTriggered] = useState(false)
  const modal = useContext(ConfirmationModalContext)
  const currentPageItems = useInfinitePagination({ items: props.items })

  useEffect(() => {
    if (!props.defaultSelected || !props.items || props.items.length === 0) {
      return
    }

    const defaultSelectedTemplate = props.items.find(item => {
      if (isBrandAsset(item)) {
        return item.id === props.defaultSelected
      }

      return item.template.id === props.defaultSelected
    })

    if (!defaultSelectedTemplate) {
      return
    }

    setSelectedTemplate(defaultSelectedTemplate)
    setPreviewModalOpen(true)
  }, [props.defaultSelected, props.items])

  const notifyDeleteError = () => {
    props.notify({
      title: 'Error deleting item. Please try again or contact support.',
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

  const handleDeleteBrandAsset = asset => {
    if (!props.onDeleteBrandAsset) {
      return
    }

    modal.setConfirmationModal({
      message: 'Delete this asset?',
      description:
        'Once deleted you and your team members would not be able to recover it.',
      confirmLabel: 'Delete',
      appearance: 'danger',
      onConfirm: async () => {
        try {
          props.onDeleteBrandAsset(asset)
        } catch (e) {
          console.error(e)
          notifyDeleteError()
        }
      }
    })
  }

  const handleBrandAssetClick = asset => {
    setPreviewModalOpen(true)
    setSelectedTemplate(asset)
    setActionTriggered(false)
    props.onSelect && props.onSelect(asset)
  }

  const handleShareBrandAssetClick = asset => {
    setPreviewModalOpen(false)
    setSelectedTemplate(asset)
    setActionTriggered(true)
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
          {currentPageItems.map(item => {
            if (item.type === 'brand_asset') {
              return (
                <BrandAssetCard
                  key={item.id}
                  asset={item}
                  actions={
                    <>
                      <div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={e => {
                            e.stopPropagation()
                            handleShareBrandAssetClick(item)
                          }}
                        >
                          Share
                        </Button>
                      </div>
                      {props.hasDeleteAccessOnBrandAsset &&
                        props.hasDeleteAccessOnBrandAsset(item) && (
                          <div>
                            <Tooltip title="Delete">
                              <IconButton
                                iconSize="large"
                                className={classes.iconButton}
                                onClick={e => {
                                  e.stopPropagation()
                                  handleDeleteBrandAsset(item)
                                }}
                              >
                                <SvgIcon path={mdiTrashCanOutline} />
                              </IconButton>
                            </Tooltip>
                          </div>
                        )}
                    </>
                  }
                  onClick={() => handleBrandAssetClick(item)}
                />
              )
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
            {selectedTemplate && isBrandAsset(selectedTemplate) && 'Share'}
            {selectedTemplate &&
              isTemplateInstance(selectedTemplate) &&
              'Continue'}
            {selectedTemplate &&
              isBrandTemplate(selectedTemplate) &&
              'Customize'}
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
