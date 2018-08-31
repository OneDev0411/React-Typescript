import React from 'react';
import Annotations from './annotations'


class Page extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return false;
  }

  async renderPage(canvas) {
    if (!canvas) return;

    const page = await this.props.document.getPage(this.props.page);

    const viewport = page.getViewport(this.props.scale);
    const { width, height } = viewport;
    const context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    page.render({
      canvasContext: context,
      viewport
    });
  }

  render() {
    return <canvas ref={this.renderPage.bind(this)} />;
  }
}

class Preview extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  async measureSpace(el) {
    if (!el)
      return

    const { document } = this.props
    const page = await document.getPage(1);
    const viewport = page.getViewport(1);

    const availableWidth = Math.min(el.clientWidth, 800)
    const availableHeight = el.clientHeight

    this.scale = availableWidth / viewport.width;

    this.setState({loading:false})
  }

//   _findDealRole(roleType) {
//     const deal = this.props.deal;
//
//     if (typeof deal !== 'object') return undefined;
//
//     if (!Array.isArray(deal.roles)) return undefined;
//
//     return deal.roles.find(r => r.role === roleType);
//   }
//
//   _getDealStampProperty(stampType) {
//     const deal = this.props.deal;
//     if (typeof deal !== 'object') return '';
//
//     const role_type =
//       deal.deal_type === 'Selling' ? 'SellerAgent' : 'BuyerAgent';
//     const agent_role = this._findDealRole(role_type);
//     if (!agent_role) return '';
//     if (!agent_role.user) return '';
//
//     const agent = agent_role.user.agent;
//     if (typeof agent !== 'object') return '';
//
//     try {
//       const values = {
//         [AGENT_NAME]: agent.full_name,
//         [AGENT_PHONE]: agent.phone_number,
//         [OFFICE_NAME]: agent.office.long_name,
//         [OFFICE_PHONE]: agent.office.phone,
//         [OFFICE_FAX]: agent.office.fax,
//         [OFFICE_ADDRESS]: agent.office.address
//       };
//
//       return values[stampType];
//     } catch (ex) {
//       return '';
//     }
//   }
//
//   get stamps() {
//     return Object.keys(this._stamps).map(pdfFormKey => ({
//       id: pdfFormKey,
//       page: this._stamps[pdfFormKey].page,
//       text: this._getDealStampProperty(this._stamps[pdfFormKey].prints.type)
//     }));
//   }
//
//   get assignments() {
//     return Object.keys(this._assignments).map(pdfFormKey => {
//       const assignment = this._assignments[pdfFormKey];
//       const role = Object.keys(assignment.assigns.roles)[0];
//       const deal_role = this._findDealRole(role);
//       let description = `${assignment.assigns.type} - `;
//
//       if (deal_role) {
//         description += deal_role.legal_full_name;
//       } else
//         description += `${role} (#${
//           assignment.assigns.roles[role]
//         })`;
//
//       return {
//         id: pdfFormKey,
//         page: assignment.page,
//         type: this._assignments[pdfFormKey].assigns.type,
//         description: description
//       };
//     });
//   }

  render() {
    const { document, values, deal, roles } = this.props
    const { loading } = this.state

    if (loading) {
      return (
        <div ref={ this.measureSpace.bind(this) } />
      )
    }

    const pages = [];
    for (let i = 1; i <= document.numPages; i++) {
      pages.push(
        <div key={i}>
          <Annotations
            deal={ deal }
            roles={ roles }
            document={document}
            page={i}
            scale={this.scale}
            values={ values }
            setValues={ this.props.setValues }
            onValueUpdate={ this.props.onValueUpdate }
          />
          <Page document={document} page={i} scale={this.scale} />
        </div>
      );
    }

    return <div>{pages}</div>;
  }
}

export default Preview;
