import React from 'react'
import { Button, Modal, FormControl } from 'react-bootstrap'
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'

export default class FormSelect extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      loading: false,
      filter: ''
    }
  }

  componentDidMount() {

  }

  loadFormsList() {
    AppDispatcher.dispatch({
      action: 'get-deal-forms',
      user: this.props.user,
    })
  }

  addForm() {

    const { forms } = this.props

    if (typeof forms === 'undefined')
      this.loadFormsList()

    this.setState({ show: true })
  }

  filter(e) {
    const filter = e.target.value
    this.setState({ filter })
  }

  onSelectForm(form) {
    this.props.onSelect(form)
    this.hide()
  }

  hide() {
    this.setState({
      filter: '',
      show: false
    })
  }

  render() {

    return (
      <div>
        <Button
            className="add-form-btn"
            onClick={ this.addForm.bind(this) }
          >
            Add Blank Form
        </Button>

        <Modal
          dialogClassName="modal-fullscreen"
          show={ this.state.show }
          bsSize="large"
          onHide={ this.hide.bind(this) }
        >
          <Modal.Body>
            <Modal.Header closeButton>
            </Modal.Header>
            <div className="select-form">
              <h1>Add forms</h1>

              <FormControl
                className="search"
                onChange={ this.filter.bind(this) }
                value={this.state.filter}
                placeholder="Search forms"
              />

              <div className="list">
                <ul>
                  {
                    _.chain(this.props.forms)
                    .filter(form => {
                      return form.title.toLowerCase().includes(this.state.filter)
                    })
                    .map(form => {
                      return (
                        <li
                          key={`form_${form.id}`}
                          onClick={this.onSelectForm.bind(this, form)}
                        >
                          <img src="/static/images/deals/file.png" />
                          { form.title }
                        </li>
                      )
                    })
                    .value()
                  }
                </ul>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}
