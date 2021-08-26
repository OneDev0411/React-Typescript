import { makeStyles, Chip } from '@material-ui/core'

const useStyles = makeStyles(
  () => ({
    container: {
      position: 'absolute',
      bottom: 30,
      left: -120,
      width: 300,
      backgroundColor: 'white',
      boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
      fontSize: 14,
      zIndex: 2,
      borderRadius: 5,
      overflow: 'hidden'
    },
    image: {
      backgroundRepeat: 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#ccc',
      height: 100
    },
    info: {
      padding: '10px 15px',
      color: '#000',
      textAlign: 'left'
    }
  }),
  { name: 'MarkerPopup' }
)

const MarkerPopup = ({ listing }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div
        className={classes.image}
        style={{ backgroundImage: `url(${listing.cover_image_url})` }}
      />
      <div className={classes.info}>
        <Chip label={`${listing.price}K`} /> {listing.address.street_address}
      </div>
    </div>
  )
}

export default MarkerPopup
