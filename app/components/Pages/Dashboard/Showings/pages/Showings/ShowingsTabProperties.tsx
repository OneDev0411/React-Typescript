import ShowingPropertyList from '../../components/ShowingPropertyList'

interface ShowingsTabPropertiesProps {
  showings: IShowing[]
}

function ShowingsTabProperties(props: ShowingsTabPropertiesProps) {
  return <ShowingPropertyList {...props} />
}

export default ShowingsTabProperties
