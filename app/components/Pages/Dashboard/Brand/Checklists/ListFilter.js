import React from 'react'
import cn from 'classnames'
import ClickOutside from 'react-click-outside'
import { Button, Col } from 'react-bootstrap'

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
    let filtered = []

    Object.keys(this.props.data).forEach((key) => {
      if (this.props.data[key].name.search(regex) > -1)
        filtered.push(this.props.data[key])
    })
    this.setState({
      filteredData: filtered
    })
  }

  render() {
    const { filteredData } = this.state
    let items = []

    Object.keys(filteredData).forEach((key) => (
      items.push(<li
        key={key}
        className={this.props.liClassName}
      >
        <Col md={6} sm={6} xs={6}>{filteredData[key].name}</Col>
        <Col md={3} sm={3} xs={3}>
          <Button
            onClick={() => this.props.addForm && this.props.addForm(filteredData[key])}
          >
          Allow Form
          </Button>
        </Col>
        <Col md={3} sm={3} xs={3}>
          <Button
            bsStyle="primary"
            onClick={() => this.props.addTask && this.props.addTask(filteredData[key])}
          >
          Add Task
          </Button>
        </Col>
      </li>)
    )
    )

    return (
      <ClickOutside
        onClickOutside={() => this.props.onChangeListFilter(false)}
      >
        <div
          className={cn(this.props.parentClassName, { active: true })}
        >
          <div className={this.props.inputContainerClassName}>
            <i
              className="fa fa-search"
              aria-hidden="true"
            />
            <input
              className={this.props.inputClassName}
              type="text"
              placeholder={this.props.placeholder}
              onChange={this.filterData}
            />
          </div>
          <ul className={this.props.ulClassName}>
            {items}
          </ul>
        </div>
      </ClickOutside>
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
  data: React.PropTypes.object
}
