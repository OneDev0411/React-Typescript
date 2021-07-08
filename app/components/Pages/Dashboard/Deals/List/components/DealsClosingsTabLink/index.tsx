import { TabLink } from '@app/views/components/PageTabs'

function DealsClosingsTabLink() {
  return (
    <TabLink
      value="closings"
      label={<span>Closings</span>}
      to="/dashboard/deals/filter/closings"
    />
  )
}

export default DealsClosingsTabLink
