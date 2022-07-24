import { FilterSlider } from '../components/FiltersSlider'
import { useContext } from '../use-context'

export function Blur() {
  const { editor, updateImage } = useContext()

  const handleChange = (value: number) => {
    editor?.board.background.image.addFilter({
      name: 'Blur',
      options: {
        blurRadius: value
      }
    })

    updateImage()
  }

  const handleRemove = () => {
    editor?.board.background.image.removeFilter({
      name: 'Blur'
    })

    updateImage()
  }

  return (
    <FilterSlider
      title="Blur"
      defaultValue={0}
      min={0}
      max={40}
      step={1}
      onChange={handleChange}
      onRemove={handleRemove}
    />
  )
}
