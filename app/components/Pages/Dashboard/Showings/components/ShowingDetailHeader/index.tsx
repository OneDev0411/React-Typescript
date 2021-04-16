import ShowingPropertyListColumnProperty, {
  ShowingPropertyListColumnPropertyProps
} from '../ShowingPropertyList/ShowingPropertyListColumnProperty'

type ShowingDetailHeaderProps = ShowingPropertyListColumnPropertyProps

function ShowingDetailHeader(props: ShowingDetailHeaderProps) {
  return <ShowingPropertyListColumnProperty {...props} />
}

export default ShowingDetailHeader
