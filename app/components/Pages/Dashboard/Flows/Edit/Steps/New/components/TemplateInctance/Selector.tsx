import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles, Theme, Typography, Box } from '@material-ui/core'
import cn from 'classnames'

import { selectUser } from 'selectors/user'

import MarketingTemplatePickerModal from 'components/MarketingTemplatePickers/MarketingTemplatePickerModal'
import { IAppState } from 'reducers'

import MarketingTemplateEditor from 'components/MarketingTemplateEditor'

import { getActiveBrand } from 'utils/user-teams'

import { getTemplateInstance } from 'models/instant-marketing/triggers/helpers/get-template-instance'

import { MarketingEmailFormData } from '../../types'

interface Props {
  disabled?: boolean
  currentBrandTemplate?: Nullable<IBrandMarketingTemplate>
  currentTemplateInstance?: Nullable<IMarketingTemplateInstance>
  value: MarketingEmailFormData['template']
  onChange: (value: MarketingEmailFormData['template']) => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {},
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerTitle: theme.typography.subtitle3,
    templateHandler: {
      color: theme.palette.secondary.main,
      cursor: 'pointer',
      '&:not(:last-child)': {
        marginRight: theme.spacing(1.25)
      }
    },
    templatePreview: {
      marginTop: theme.spacing(1),
      height: '445px',
      background: theme.palette.grey[100],
      borderRadius: `${theme.spacing(2)}px`,
      textAlign: 'center',
      color: theme.palette.secondary.main,
      overflow: 'hidden',
      cursor: 'pointer',
      ...theme.typography.body2
    },
    templatePreviewImage: {
      display: 'block',
      maxWidth: '100%'
    },
    templatePreviewPlaceholder: {
      display: 'block',
      lineHeight: '445px'
    },
    disabled: {
      opacity: 0.4,
      '& $templateHandler, & $templatePreview': {
        cursor: 'default'
      }
    }
  }),
  { name: 'FlowTemplateSelector' }
)

export const TemplateSelector = ({
  value,
  disabled = false,
  currentBrandTemplate = null,
  currentTemplateInstance = null,
  onChange
}: Props) => {
  const classes = useStyles()
  const user = useSelector<IAppState, IUser>(selectUser)
  const [brand] = useState<Nullable<IBrand>>(getActiveBrand(user))
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState<boolean>(
    false
  )
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedBrandTemplate, setSelectedBrandTemplate] = useState<
    Nullable<IBrandMarketingTemplate>
  >(currentBrandTemplate)
  const [selectedTemplateInstance, setSelectedTemplateInstace] = useState<
    Nullable<IMarketingTemplateInstance>
  >(currentTemplateInstance)
  const currentTemplate = selectedBrandTemplate || selectedTemplateInstance

  const handleSelectTemplate = async (template: IBrandMarketingTemplate) => {
    try {
      setIsTemplatePickerOpen(false)
      setIsLoading(true)

      if (!brand) {
        return
      }

      if (selectedTemplateInstance) {
        setSelectedTemplateInstace(null)
      }

      setSelectedBrandTemplate(template)
      onChange({
        isInstance: false,
        id: template.id
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditTemplate = async (markup: string) => {
    try {
      const templateId = selectedBrandTemplate
        ? selectedBrandTemplate.template?.id
        : selectedTemplateInstance?.id

      if (!templateId) {
        return
      }

      setIsLoading(true)
      setIsBuilderOpen(false)

      const templateInstance = await getTemplateInstance(templateId, markup)

      setSelectedTemplateInstace(templateInstance)
      onChange({
        isInstance: true,
        id: templateInstance.id
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowTemplatePicker = (state: boolean = false) => {
    if (disabled) {
      return
    }

    setIsTemplatePickerOpen(state)
  }

  const handleShowBuilder = (state: boolean = false) => {
    if (disabled) {
      return
    }

    setIsBuilderOpen(state)
  }

  const renderPreview = () => {
    if (isLoading) {
      return (
        <span className={classes.templatePreviewPlaceholder}>Loading...</span>
      )
    }

    if (disabled || (!selectedBrandTemplate && !selectedTemplateInstance)) {
      return (
        <span className={classes.templatePreviewPlaceholder}>
          Select a template
        </span>
      )
    }

    if (selectedTemplateInstance) {
      return (
        <img
          src={selectedTemplateInstance.file.preview_url}
          alt="Selected Template"
          className={classes.templatePreviewImage}
        />
      )
    }

    if (selectedBrandTemplate) {
      return (
        <img
          src={selectedBrandTemplate.preview.preview_url}
          alt="Selected Template"
          className={classes.templatePreviewImage}
        />
      )
    }

    return (
      <span className={classes.templatePreviewPlaceholder}>
        Somthing went wrong :(
      </span>
    )
  }

  return (
    <>
      <div className={cn(classes.container, { [classes.disabled]: disabled })}>
        <div className={classes.header}>
          <span className={classes.headerTitle}>Template</span>
          <Box display="inline-flex">
            {currentTemplate && (
              <Typography
                variant="body2"
                className={classes.templateHandler}
                onClick={() => handleShowBuilder(true)}
              >
                Edit
              </Typography>
            )}
            {(selectedBrandTemplate || selectedTemplateInstance) && (
              <Typography
                variant="body2"
                className={classes.templateHandler}
                onClick={() => handleShowTemplatePicker(true)}
              >
                Change
              </Typography>
            )}
          </Box>
        </div>
        <div
          className={classes.templatePreview}
          onClick={() => handleShowTemplatePicker(true)}
        >
          {renderPreview()}
        </div>
      </div>
      {isTemplatePickerOpen && (
        <MarketingTemplatePickerModal
          title="Select Template"
          user={user}
          mediums={['Email']}
          templateTypes={[]}
          onSelect={handleSelectTemplate}
          onClose={() => handleShowTemplatePicker(false)}
        />
      )}
      {isBuilderOpen && currentTemplate && (
        <MarketingTemplateEditor
          template={currentTemplate}
          templateData={{ user }}
          onSave={handleEditTemplate}
          onClose={() => handleShowBuilder(false)}
        />
      )}
    </>
  )
}
