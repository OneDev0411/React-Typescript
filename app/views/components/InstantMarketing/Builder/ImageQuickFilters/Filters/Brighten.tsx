import { FilterSlider } from '../components/FiltersSlider'
import { useContext } from '../use-context'

export function Brighten() {
  const { editor, updateImage } = useContext()

  const handleChange = (value: number) => {
    editor?.board.background.image.addFilter({
      name: 'Brighten',
      options: {
        brightness: value
      }
    })

    updateImage()
  }

  const handleRemove = () => {
    editor?.board.background.image.removeFilter({
      name: 'Brighten'
    })

    updateImage()
  }

  return (
    <FilterSlider
      title="Brightness"
      defaultValue={0}
      min={-1}
      max={1}
      step={0.05}
      formatter={value => value * 100}
      onChange={handleChange}
      onRemove={handleRemove}
    />
  )
}
