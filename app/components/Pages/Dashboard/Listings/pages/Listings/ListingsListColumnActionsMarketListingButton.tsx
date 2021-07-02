import { Button, ButtonProps } from '@material-ui/core'

type ListingsListColumnActionsMarketListingButtonProps = Omit<
  ButtonProps,
  'onClick' | 'children'
>

function ListingsListColumnActionsMarketListingButton(
  props: ListingsListColumnActionsMarketListingButtonProps
) {
  return (
    <Button {...props} onClick={() => alert('The action is not implemented')}>
      {/* TODO: Connect this to Mamal's page */}
      Market Listing
    </Button>
  )
}

export default ListingsListColumnActionsMarketListingButton
