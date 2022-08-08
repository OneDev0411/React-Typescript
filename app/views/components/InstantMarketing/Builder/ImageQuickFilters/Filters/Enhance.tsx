import { FilterSlider } from '../components/FiltersSlider'
import { useContext } from '../use-context'

export function Enhance() {
  const { editor, updateImage } = useContext()

  const handleChange = (value: number) => {
    editor?.board.background.image.addFilter({
      name: 'Enhance',
      options: {
        enhance: value
      }
    })

    updateImage()
  }

  const handleRemove = () => {
    editor?.board.background.image.removeFilter({
      name: 'Enhance'
    })

    updateImage()
  }

  return (
    <FilterSlider
      title="Enhance"
      defaultValue={0}
      min={-1}
      max={1}
      step={0.01}
      formatter={value => value * 100}
      onChange={handleChange}
      onRemove={handleRemove}
    />
  )
}
