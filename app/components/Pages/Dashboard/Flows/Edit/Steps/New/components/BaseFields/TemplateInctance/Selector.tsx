import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  makeStyles,
  Theme,
  Button,
  Grid,
  Typography
} from '@material-ui/core'
import cn from 'classnames'

import { mdiEyeOutline } from '@mdi/js'

import { selectUser } from 'selectors/user'

import MarketingTemplateAndTemplateInstancePickerModal from 'components/MarketingTemplatePickers/MarketingTemplateAndTemplateInstancePickerModal'

import { IAppState } from 'reducers'

import MarketingTemplateEditor from 'components/MarketingTemplateEditor'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { getActiveBrand } from 'utils/user-teams'

import { getTemplateInstance } from 'models/instant-marketing/triggers/helpers/get-template-instance'

import { MarketingEmailFormData } from '../../../types'

interface Props {
  disabled?: boolean
  currentBrandTemplate?: Nullable<IBrandMarketingTemplate>
  currentTemplateInstance?: Nullable<IMarketingTemplateInstance>
  onChange: (value: MarketingEmailFormData['template']) => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative',
      height: '560px', // From figma
      background: theme.palette.grey[100],
      borderRadius: theme.shape.borderRadius,
      textAlign: 'center',
      color: theme.palette.secondary.main,
      overflow: 'hidden',
      cursor: 'pointer',
      ...theme.typography.body2,
      '&:hover $containerPreview': {
        visibility: 'visible',
        opacity: 1
      }
    },
    containerPreview: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.palette.action.active,
      borderRadius: theme.shape.borderRadius,
      cursor: 'default',
      transition: 'all 0.2s linear',
      visibility: 'hidden',
      opacity: 0
    },
    containerPreviewTitle: {
      marginBottom: theme.spacing(2),
      color: theme.palette.primary.contrastText
    },
    templateAction: {
      background: theme.palette.background.paper,
      width: '160px'
    },
    templateImage: {
      display: 'block',
      maxWidth: '100%'
    },
    templatePreviewPlaceholder: {
      display: 'block',
      lineHeight: '550px' // From figma
    },
    disabled: {
      opacity: 0.4,
      '& $templateHandler, & $container': {
        cursor: 'default'
      }
    }
  }),
  { name: 'FlowTemplateSelector' }
)

export const TemplateSelector = ({
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
  const currentTemplate = useMemo(
    () => selectedBrandTemplate || selectedTemplateInstance,
    [selectedBrandTemplate, selectedTemplateInstance]
  )

  const handleSelectTemplate = async (
    template: IBrandMarketingTemplate | IMarketingTemplateInstance
  ) => {
    try {
      setIsTemplatePickerOpen(false)
      setIsLoading(true)

      if (!brand) {
        return
      }

      const isTemplateInstance = template.type === 'template_instance'

      if (isTemplateInstance) {
        if (selectedBrandTemplate) {
          setSelectedBrandTemplate(null)
        }

        setSelectedTemplateInstace(template as IMarketingTemplateInstance)
      } else {
        if (selectedTemplateInstance) {
          setSelectedTemplateInstace(null)
        }

        setSelectedBrandTemplate(template as IBrandMarketingTemplate)
      }

      onChange({
        isInstance: isTemplateInstance,
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
        : selectedTemplateInstance?.template?.id

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

    if (!currentTemplate) {
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
          className={classes.templateImage}
        />
      )
    }

    if (selectedBrandTemplate) {
      return (
        <img
          src={selectedBrandTemplate.preview.preview_url}
          alt="Selected Template"
          className={classes.templateImage}
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
      <Box className={cn(classes.container, { [classes.disabled]: disabled })}>
        <Box
          className={classes.container}
          onClick={() =>
            !currentTemplate && !disabled && handleShowTemplatePicker(true)
          }
        >
          {!isLoading && currentTemplate && !disabled && (
            <Box className={classes.containerPreview}>
              <Box>
                <Box className={classes.containerPreviewTitle}>
                  <SvgIcon path={mdiEyeOutline} size={muiIconSizes.large} />
                  <Typography variant="subtitle1">View Template</Typography>
                </Box>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justify="center"
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      size="small"
                      className={classes.templateAction}
                      onClick={() => handleShowBuilder(true)}
                    >
                      Edit
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      size="small"
                      className={classes.templateAction}
                      onClick={() => handleShowTemplatePicker(true)}
                    >
                      Change
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
          {renderPreview()}
        </Box>
      </Box>
      {isTemplatePickerOpen && (
        <MarketingTemplateAndTemplateInstancePickerModal
          title="Select Template"
          user={user}
          mediums={['Email']}
          templateTypes={[
            'Birthday',
            'WeddingAnniversary',
            'HomeAnniversary',
            'OpenHouse',
            'JustSold',
            'ComingSoon',
            'JustListed',
            'PriceImprovement'
          ]}
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
