import config from '../../../config/private'

export const API_URL = 'https://bfsir.mymarketingmatters.com/PunchoutSetup.asp'
export const DUNS = config.my_marketing_matters.duns
export const SHARED_SECRET = config.my_marketing_matters.shared_secret

export const REQUEST_BODY_TEMPLATE = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE cXML SYSTEM "http://xml.cXML.org/schemas/cXML/1.2.007/cXML.dtd">
<cXML payloadID="optional" timestamp="optional" version="1.0" xml:lang="en">
  <Header>
    <From>
      <Credential domain="DUNS">
        <Identity>{{ duns }}</Identity>
      </Credential>
    </From>
    <To>
      <Credential domain="DUNS">
        <Identity />
      </Credential>
    </To>
    <Sender>
      <Credential domain="NetworkUserId">
        <Identity />
        <SharedSecret>{{ networkUserIdSharedSecret }}</SharedSecret>
      </Credential>
      <UserAgent>Rechat - Web</UserAgent>
    </Sender>
  </Header>
  <Request deploymentMode="test">
    <PunchOutSetupRequest operation="create">
      <BuyerCookie>{{ user.id }}</BuyerCookie>
      <Extrinsic name="CostCenter">{{ user.costCenter }}</Extrinsic>
      <Extrinsic name="UserEmail">{{ user.email }}</Extrinsic>
      <Extrinsic name="UniqueName">{{ user.uniqueName }}</Extrinsic>
      <Extrinsic name="FirstName">{{ user.firstName }}</Extrinsic>
      <Extrinsic name="LastName">{{ user.lastName }}</Extrinsic>
      <Extrinsic name="StartPoint"></Extrinsic>
      <BrowserFormPost>
        <URL>{{ callbackUrl }}</URL>
      </BrowserFormPost>
      <Properties>
        {% for property in properties %}
          <Property>
            <ID>{{ property.id }}</ID>
            <Price>{{ property.price }}</Price>
            <Address>{{ property.address }}</Address>
            <City>{{ property.city }}</City>
            <State>{{ property.state }}</State>
            <Zip>{{ property.zip }}</Zip>
            <Description>{{ property.description }}</Description>
            <Pictures>
              {% for picture in property.pictures %}
                <Picture>
                  <ID>{{ picture.id }}</ID>
                  <Caption>{{ picture.caption }}</Caption>
                  <FileName>{{ picture.filename }}</FileName>
                  <URL>{{ picture.url }}</URL>
                </Picture>
              {% endfor %}
            </Pictures>
          </Property>
        {% endfor %}
      </Properties>
    </PunchOutSetupRequest>
  </Request>
</cXML>
`
