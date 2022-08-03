import { FilterCheckbox } from '../components/FilterCheckbox'
import { useContext } from '../use-context'

export function Grayscale() {
  const { updateImage } = useContext()

  return (
    <FilterCheckbox
      title="Grayscale"
      filter={{
        name: 'Grayscale'
      }}
      onChange={updateImage}
    />
  )
}
