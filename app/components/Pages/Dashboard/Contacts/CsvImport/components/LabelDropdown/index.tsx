import { BaseDropdown } from '@app/views/components/BaseDropdown'

export function LabelDropdown() {
  return (
    <BaseDropdown
      renderDropdownButton={buttonProps => <div {...buttonProps}>+++</div>}
      renderMenu={() => <div>Menu</div>}
    />
  )
}
