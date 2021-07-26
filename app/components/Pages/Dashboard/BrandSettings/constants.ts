export const TEMPLATE = `
<!--justsold2-->

<mjml>
  <mj-head>
    <mj-attributes></mj-attributes>
    <mj-style inline="inline">

      a { text-decoration: none; color: inherit; }

      


    </mj-style>
          <mj-style>
            .text-padding {padding:38px 80px 0px;}
         
            @media (min-width:768px){

              #text1{text-align: center !important;}
              #text2{text-align: center !important;}
              #text3{text-align: center !important;}
            }

            @media (max-width:480px) { 
              .header-text div{line-height: normal !important;font-size:17px !important;}
              .img-right1-padding {padding-right: 0 !important;}
              .img-left-padding {padding-left: 0 !important;padding-top:8px 							 !important;}
              .img-left1-padding {padding-left: 0 !important;}
       
               #text1{text-align: center !important;}
               #text2{text-align: center !important;}
               #text3{text-align: center !important;}
                   .header-text{padding:15px 40px 0 !important;}
                    .text3 {padding:0 40px !important;}
                    .text4 {padding:0 40px 56px !important;}
               .text3 div{font-size:14px !important;}
               .text4 div{font-size:14px !important;}
               .inform-text div{font-size:14px !important;}
               .inform-text1 div{font-size:12px !important;}
                   
             }
                   @media (max-width:414px) and (min-width:320px) { 
              .header-text div{line-height: normal !important;font-size:17px !important;}
              .img-right1-padding {padding-right: 0 !important;}
              .img-left-padding {padding-left: 0 !important;padding-top:8px 							 !important;}
              .img-left1-padding {padding-left: 0 !important;}
       
               #text1{text-align: center !important;}
               #text2{text-align: center !important;}
               #text3{text-align: center !important;}
                     .header-text{padding:15px 40px 0 !important;}
                   .text3 {padding:0 40px !important;}
                   .text4 {padding:0 40px 56px !important;}
               .text3 div{font-size:14px !important;}
               .text4 div{font-size:14px !important;}
               .inform-text div{font-size:14px !important;}
               .inform-text1 div{font-size:12px !important;}
                   
             }

      .img-fit img{object-fit:cover;}


    </mj-style>
    {% include 'palette.mjml' %}
 </mj-head>

  <mj-body mj-class="body" padding="0">
    <mj-section padding-bottom="20px" padding-top="20px" padding-left="40px" padding-right="40px">

    </mj-section>


    <mj-section mj-class="container" padding-left="40px" padding-right="40px" padding-top="40px"  padding-bottom="0px">
      <mj-column width="100%" padding="0px">
        <mj-image rechat-assets="listing-image" css-class="img-fit responsiveimg" padding="0px" src="{{listing.gallery_image_urls[0]}}" href="{{getListingUrl(listing)}}" padding-bottom="8px"></mj-image>
      </mj-column>
    </mj-section>

    <mj-section mj-class="container" padding="0px">

      <mj-group>
          <mj-column>
              <mj-text mj-class="h1" align="left" rechat-editable="true" css-class="header-text" padding="35px 70px 0"  > 
                    Under Contract!
                  </mj-text>
                  <mj-text  mj-class="h2" rechat-editable="true" padding="0 70px" css-class="text3" align="left" >
                      <p > {{listing.property.address.street_address}}  </p>
                    </mj-text>
          
            <mj-text  mj-class="h3" rechat-editable="true" padding="0 70px" css-class="text3" align="left" >
                <p  style="margin:8px 0">   {{ listing.price | currency }}
               </p>
              </mj-text>
                <mj-text  mj-class="light" rechat-editable="true" padding="0 70px" css-class="text3" align="left" >
                        <p  style="margin:8px 0">    
                 {{listing.property.address.city}},{{listing.property.address.state}},{{listing.property.address.postal_code}}</p>
                      </mj-text>
                      
                        <mj-text  mj-class="light" rechat-editable="true" css-class="text4" align="left"  padding="0 70px 56px" >
                            <p  id="text4" style="margin:8px 0"> {{listing.property.bedroom_count}} Beds, {{listing.property.full_bathroom_count + listing.property.half_bathroom_count}} Baths, {{ listing.property.square_meters | area }} Sqft</p>
                          </mj-text> 
          </mj-column>

        </mj-group>
    
    </mj-section>
    

        <mj-section mj-class="container" padding="0px">
    <mj-column padding="0px">
      <mj-button rechat-editable="true" href="{{getListingUrl(listing)}}"  padding="0px 0 36px" >
        VIEW PROPERTY
      </mj-button>
    </mj-column>
  </mj-section>
    
    
        <mj-section padding="0px">
    <mj-column padding="0px">
      <mj-divider padding="0px" border-width="2px" border-style="solid" border-color="{{get('body-bg-color')}}"></mj-divider>
    </mj-column>
  </mj-section>


  <mj-wrapper mj-class="container" padding="50px 30px">
    <mj-section mj-class="inverted-container" padding="56px 40px">
      <mj-column padding="0px">
        <mj-image padding="0px" align="center" rechat-assets="avatar" src="{{user.profile_image_url}}" width="135px"></mj-image>
      </mj-column>

        <mj-column vertical-align="middle" padding-top="5px" padding="0px">
        <mj-text mj-class="inverted-container" padding="0px" rechat-editable="true" align="left"  css-class="inform-text">
          <p id="text1">{{user.display_name}}</p>
        </mj-text>
        <mj-text mj-class="inverted-container" padding="0px" rechat-editable="true" align="left"  css-class="inform-text1">
          <p  id="text2" ><a href="mailto:{{user.email}}"  style="text-decoration: none;">{{user.email}}</a></p> 
        </mj-text>
        <mj-text mj-class="inverted-container" padding="0px" rechat-editable="true" align="left"   css-class="inform-text1">
          <p  id="text3" ><a href="tel:{{ user.phone_number }}"  style="text-decoration: none;">{{ user.phone_number | phone}}</a></p>
        </mj-text>
      </mj-column>   
    </mj-section>
        </mj-wrapper>
    

    
    <mj-section mj-class="body" padding="20px 0">
      <mj-column padding="0px">
        {% if get('body-logo-wide') %}
        <mj-image width="180px" padding="24px 0 12px 0" src="{{get('body-logo-wide')}}" href="#"></mj-image>
        {% else %}
        <mj-image width="180px" padding="24px 0 12px 0" src="{{get('body-logo-square')}}" href="#"></mj-image>
        {% endif %} 
        <mj-text mj-class="body" padding="0px" align="center" >
          <p>Powered by Rechat™</p>
        </mj-text>   
        <mj-text mj-class="body" padding="0px" align="center" >
          <p>Rechat ® 2020, All Rights Reserved.</p>
        </mj-text>
        <mj-text mj-class="body" padding="0px" align="center" >
                   <p><a  style="text-decoration:underline;margin-right: 8px;"
            href="https://itunes.apple.com/us/app/rechat/id974093560?mt=8" >Download
            the iOS app</a> <a href="%tag_unsubscribe_url%" style="text-decoration:underline;margin-left: 8px;">Unsubscribe
            from this list</a></p>
        </mj-text>
      </mj-column>
    </mj-section>


  </mj-body>
</mjml>
`
