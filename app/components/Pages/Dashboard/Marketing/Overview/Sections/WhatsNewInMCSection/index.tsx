import { useState } from 'react'

import {
  Grid,
  Typography,
  Button,
  Box,
  Theme,
  makeStyles
} from '@material-ui/core'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import CardSkeleton from 'components/CardSkeleton'
import MarketingTemplateCard from 'components/MarketingTemplateCard'
import TemplateAction from 'components/TemplatesList/TemplateAction'

import { useTemplates } from '../../../hooks/use-templates'
import SectionLayout from '../SectionLayout'

const SOCIAL_TEMPLATE_MEDIUMS: IMarketingTemplateMedium[] = [
  'Social',
  'FacebookCover',
  'LinkedInCover',
  'InstagramStory',
  'TwitterCover',
  'YouTubeCover'
]

const useStyles = makeStyles(
  (theme: Theme) => ({
    templateCardContainer: {
      cursor: 'pointer'
    },
    shareButton: {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.secondary.main}`
    }
  }),
  {
    name: 'MarketingWhatsNewInMCSection'
  }
)

export default function WhatsNewInMCSection() {
  const classes = useStyles()
  const activeBrandId = useActiveBrandId()
  const [selectedTemplate, setSelectedTemplate] =
    useState<Nullable<IBrandMarketingTemplate>>(null)
  const [isTemplateClicked, setIsTemplateClicked] = useState<boolean>(false)

  const { templates, isLoading } = useTemplates(
    activeBrandId,
    SOCIAL_TEMPLATE_MEDIUMS
  )

  const handleSelectTemplate = (template: IBrandMarketingTemplate) => {
    if (isTemplateClicked) {
      return
    }

    setSelectedTemplate(template)
    setIsTemplateClicked(true)
  }

  return (
    <>
      <SectionLayout title="What's new in Marketing Center">
        <>
          {isLoading && (
            <>
              <Grid item xs={12} sm={6} md={2}>
                <CardSkeleton />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <CardSkeleton />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <CardSkeleton />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <CardSkeleton />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <CardSkeleton />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <CardSkeleton />
              </Grid>
            </>
          )}
          {!isLoading && templates.length === 0 && (
            <Typography variant="h6">No designs to show</Typography>
          )}
          {!isLoading &&
            templates.slice(0, 6).map(template => (
              <Grid
                key={template.id}
                className={classes.templateCardContainer}
                item
                xs={12}
                sm={6}
                md={2}
              >
                <MarketingTemplateCard
                  template={template}
                  actions={
                    <Grid container item>
                      <Box p={2} width="100%">
                        <Button
                          fullWidth
                          variant="contained"
                          className={classes.shareButton}
                          onClick={() => handleSelectTemplate(template)}
                        >
                          {isTemplateClicked ? 'Loading' : 'Share'}
                        </Button>
                      </Box>
                    </Grid>
                  }
                />
              </Grid>
            ))}
        </>
      </SectionLayout>
      {selectedTemplate && (
        <TemplateAction
          type={selectedTemplate.template.type}
          medium={selectedTemplate.template.medium}
          isTriggered={isTemplateClicked}
          setTriggered={setIsTemplateClicked}
          setEditActionTriggered={setIsTemplateClicked}
          selectedTemplate={selectedTemplate}
        />
      )}
    </>
  )
}
