import { mdiShapeOutline } from '@mdi/js'

import FilterButton from '@app/views/components/Filters/FilterButton'

import { TypesList } from '../components/TypesList'

import { Button } from './components/Button'

export function TypeFilter() {
  return (
    <FilterButton
      renderButton={({ onClick }) => (
        <Button
          title="Type"
          startIconPath={mdiShapeOutline}
          isActive={false}
          onClick={onClick}
        />
      )}
      renderDropdown={() => (
        <TypesList selectedItem={null} onSelectItem={() => {}} />
      )}
    />
  )
}
