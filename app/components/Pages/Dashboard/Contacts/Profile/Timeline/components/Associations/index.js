import React from 'react'
import Flex from 'styled-flex-component'

import { getAssociations } from '../../../../../../../../views/components/EventDrawer/helpers/get-associations'
import { AssociationItem } from '../../../../../../../../views/components/AssocationItem'

export class Associations extends React.Component {
  state = {
    associations: []
  }

  componentDidMount() {
    this.fetchAssociations()
  }

  fetchAssociations = async () => {
    try {
      const associations = await getAssociations(this.props.task)

      this.setState({ associations })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <Flex wrap>
        {this.state.associations.map((association, index) => {
          if (
            association[association.association_type].id ===
            this.props.contact.id
          ) {
            return null
          }

          return (
            <AssociationItem
              association={association}
              key={`association_${index}`}
              isRemovable={false}
            />
          )
        })}
      </Flex>
    )
  }
}
