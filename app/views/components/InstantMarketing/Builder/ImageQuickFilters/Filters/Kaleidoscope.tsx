import { FilterSlider } from '../components/FiltersSlider'
import { useContext } from '../use-context'

export function Kaleidoscope() {
  const { editor, updateImage } = useContext()

  const handleChange = (value: number) => {
    editor?.board.background.image.addFilter({
      name: 'Kaleidoscope',
      options: {
        kaleidoscopePower: 3,
        kaleidoscopeAngle: value
      }
    })

    updateImage()
  }

  const handleRemove = () => {
    editor?.board.background.image.removeFilter({
      name: 'Kaleidoscope'
    })

    updateImage()
  }

  return (
    <FilterSlider
      title="Kaleidoscope"
      defaultValue={0}
      min={0}
      max={360}
      step={5}
      onChange={handleChange}
      onRemove={handleRemove}
    />
  )
}
