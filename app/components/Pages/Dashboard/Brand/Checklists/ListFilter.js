import React from 'react'

export default class ListFilter extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      filteredData: this.props.data
    }
    this.filterData = this.filterData.bind(this)
  }

  filterData(e) {
    e.preventDefault()
    const regex = new RegExp(e.target.value, 'i')
    const filtered = this.props.data.filter((datum) => (datum.search(regex) > -1))

    this.setState({
      filteredData: filtered
    })
  }

  render() {
    const { filteredData } = this.state
    const items = filteredData.map((datum) => (
      <li
        className={this.props.liClassName}
      >{datum}
      </li>)
    )

    return (
      <div className={this.props.parentClassName}>
        <div className={this.props.inputContainerClassName}>
          <i
            className="fa fa-search"
            aria-hidden="true"
          />
          <input
            className={this.props.inputClassName}
            type="text" placeholder={this.props.placeholder}
            onChange={this.filterData}
          />
        </div>
        <ul className={this.props.ulClassName}>
          {items}
        </ul>
      </div>
    )
  }
}

ListFilter.propTypes = {
  parentClassName: React.PropTypes.string,
  ulClassName: React.PropTypes.string,
  liClassName: React.PropTypes.string,
  inputContainerClassName: React.PropTypes.string,
  inputClassName: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  data: React.PropTypes.array
}
