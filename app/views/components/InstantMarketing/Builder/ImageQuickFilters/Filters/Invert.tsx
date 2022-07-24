import { FilterCheckbox } from '../components/FilterCheckbox'
import { useContext } from '../use-context'

export function Invert() {
  const { updateImage } = useContext()

  return (
    <FilterCheckbox
      title="Invert"
      filter={{
        name: 'Invert'
      }}
      onChange={updateImage}
    />
  )
}
