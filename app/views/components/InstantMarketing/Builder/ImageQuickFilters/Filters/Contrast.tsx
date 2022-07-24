import { FilterSlider } from '../components/FiltersSlider'
import { useContext } from '../use-context'

export function Contrast() {
  const { editor, updateImage } = useContext()

  const handleChange = (value: number) => {
    editor?.board.background.image.addFilter({
      name: 'Contrast',
      options: {
        contrast: value
      }
    })

    updateImage()
  }

  const handleRemove = () => {
    editor?.board.background.image.removeFilter({
      name: 'Contrast'
    })

    updateImage()
  }

  return (
    <FilterSlider
      title="Contrast"
      defaultValue={0}
      min={-100}
      max={100}
      step={1}
      onChange={handleChange}
      onRemove={handleRemove}
    />
  )
}
