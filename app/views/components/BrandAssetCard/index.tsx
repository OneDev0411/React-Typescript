import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    card: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      position: 'relative' as any,
      borderRadius: 3,
      transition: '0.3s',
      minHeight: '15.8rem',
      background: theme.palette.grey['200'],
      overflow: 'hidden',
      boxShadow: theme.shadows[2],
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.2)',
        opacity: 0,
        zIndex: 1,
        transition: 'all 0.5s'
      },
      '&:hover': {
        '&::after': {
          opacity: 1
        }
      }
    },
    imageThumbnail: {
      maxWidth: '100%',
      objectFit: 'cover'
    }
  }),
  {
    name: 'BrandAssetCard'
  }
)

interface Props {
  asset: IBrandAsset
  onClick: () => void
}

export default function BrandAssetCard({ asset }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.card}>
      <img
        alt={asset.label}
        src={asset.file.url}
        className={classes.imageThumbnail}
      />
    </div>
  )
}
