import { Button, makeStyles, Theme } from '@material-ui/core'
import { mdiImageOutline } from '@mdi/js'

import { readFileAsDataUrl } from '@app/utils/file-utils/read-file-as-data-url'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useImageEditor } from '../../../hooks/use-image-editor'

const useStyles = makeStyles(
  (theme: Theme) => ({
    input: {
      display: 'none !important'
    },
    addImage: {
      margin: theme.spacing(0, 1, 0, 0)
    }
  }),
  {
    name: 'ImageEditorAddImage'
  }
)

export function Image() {
  const { editor } = useImageEditor()
  const classes = useStyles()

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files) {
      return
    }

    const url = await readFileAsDataUrl(files[0])

    editor?.shapes.image.insert(url)
  }

  return (
    <>
      <input
        id="editor-add-image"
        accept="image/*"
        className={classes.input}
        multiple={false}
        type="file"
        onChange={handleAddImage}
      />

      <label htmlFor="editor-add-image" className={classes.addImage}>
        <Button
          startIcon={
            <SvgIcon path={mdiImageOutline} size={muiIconSizes.small} />
          }
          variant="outlined"
          {...{
            component: 'span'
          }}
        >
          Add Image
        </Button>
      </label>
    </>
  )
}
