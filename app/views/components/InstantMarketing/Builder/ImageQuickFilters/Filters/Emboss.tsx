import { FilterSlider } from '../components/FiltersSlider'
import { useContext } from '../use-context'

export function Emboss() {
  const { editor, updateImage } = useContext()

  const handleChange = (value: number) => {
    editor?.board.background.image.addFilter({
      name: 'Emboss',
      options: {
        embossStrength: value,
        embossDirection: 'top',
        embossWhiteLevel: 0.5,
        embossBlend: true
      }
    })

    updateImage()
  }

  const handleRemove = () => {
    editor?.board.background.image.removeFilter({
      name: 'Emboss'
    })

    updateImage()
  }

  return (
    <FilterSlider
      title="Emboss"
      defaultValue={0}
      min={0}
      max={1}
      step={0.1}
      onChange={handleChange}
      onRemove={handleRemove}
    />
  )
}
