import { FilterSlider } from '../components/FiltersSlider'
import { useContext } from '../use-context'

export function Noise() {
  const { editor, updateImage } = useContext()

  const handleChange = (value: number) => {
    editor?.board.background.image.addFilter({
      name: 'Noise',
      options: {
        noise: value
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
      title="Noise"
      defaultValue={0}
      min={0}
      max={4}
      step={0.1}
      formatter={value => value * 10}
      onChange={handleChange}
      onRemove={handleRemove}
    />
  )
}
