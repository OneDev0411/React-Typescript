import { CircularProgress } from '@material-ui/core'
import { useSelector } from 'react-redux'

import useAsync from '@app/hooks/use-async'
import useListingsEditorAssets from '@app/hooks/use-listings-editor-assets'
import { createTemplateInstance } from '@app/models/instant-marketing/create-template-instance'
import { selectUser } from '@app/selectors/user'
import MarketingTemplateEditor, {
  MarketingTemplateEditorProps
} from '@app/views/components/MarketingTemplateEditor'

interface SuperCampaignTemplateEditorProps
  extends Omit<
    MarketingTemplateEditorProps,
    | 'templateData'
    | 'template'
    | 'assets'
    | 'saveButtonStartIcon'
    | 'actionButtonsDisabled'
    | 'onSave'
  > {
  template: IMarketingTemplateInstance
  onTemplateSave: (template: IMarketingTemplateInstance) => Promise<void> | void
}

function SuperCampaignTemplateEditor({
  template,
  onTemplateSave,
  ...otherProps
}: SuperCampaignTemplateEditorProps) {
  const user = useSelector(selectUser)
  const listingAssets = useListingsEditorAssets(template.listings)

  const { isLoading, run } = useAsync()

  const handleSave = async (markup: string) => {
    run(async () => {
      const listings = template.listings?.map(listing => listing.id)
      const deals = template.deals?.map(deal => deal.id)
      const contacts = template.contacts?.map(contact => contact.id)

      const instance = await createTemplateInstance(template.template.id, {
        html: markup,
        listings,
        deals,
        contacts
      })

      await onTemplateSave({
        ...instance,
        listings: template.listings,
        deals: template.deals,
        contacts: template.contacts
      })
    })
  }

  return (
    <MarketingTemplateEditor
      {...otherProps}
      template={template}
      templateData={{
        user,
        listings: template.listings ?? undefined,
        listing: template.listings?.[0],
        contact: template.contacts?.[0]
      }}
      assets={listingAssets}
      saveButtonStartIcon={
        isLoading && <CircularProgress color="inherit" size={20} />
      }
      actionButtonsDisabled={isLoading}
      onSave={handleSave}
      templatePurpose="ForCampaigns"
    />
  )
}

export default SuperCampaignTemplateEditor
