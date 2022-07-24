import { FilterSlider } from '../components/FiltersSlider'
import { useContext } from '../use-context'

export function Pixelate() {
  const { editor, updateImage } = useContext()

  const handleChange = (value: number) => {
    if (value <= 0) {
      return
    }

    editor?.board.background.image.addFilter({
      name: 'Pixelate',
      options: {
        pixelSize: value
      }
    })

    updateImage()
  }

  const handleRemove = () => {
    editor?.board.background.image.removeFilter({
      name: 'Noise'
    })

    updateImage()
  }

  return (
    <FilterSlider
      title="Pixelate"
      defaultValue={0}
      min={0}
      max={20}
      step={1}
      formatter={value => value * 10}
      onChange={handleChange}
      onRemove={handleRemove}
    />
  )
}
