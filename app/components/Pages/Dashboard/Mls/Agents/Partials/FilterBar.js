// Agents/FilterBar.js
import React, { Component } from 'react'
import S from 'shorti'
import moment from 'moment'
import { Input } from 'react-bootstrap'

// AppDispatcher
import AppDispatcher from '../../../../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../../../../stores/AppStore'

export default class FilterBar extends Component {
  doubleDigit(str) {
    return ('00' + str).slice(-2)
  }

  getTime(year, month, day) {
    return moment(year + '-' + this.doubleDigit(month) + '-' + this.doubleDigit(day)).toISOString()
  }

  getFromTime() {
    return this.getTime(this.refs.from_year.refs.input.value,
                   this.refs.from_month.refs.input.value,
                   this.refs.from_day.refs.input.value)
  }

  getToTime() {
    return this.getTime(this.refs.to_year.refs.input.value,
                   this.refs.to_month.refs.input.value,
                   this.refs.to_day.refs.input.value)
  }

  handleSubmit(e) {
    e.preventDefault()

    const criteria = {}

    criteria.from = this.getFromTime()
    criteria.to = this.getToTime()

    criteria.area = this.refs.area.refs.input.value
//     criteria.subarea = this.refs.subarea.refs.input.value

    criteria.list_volume = {
      min: null,
      max: null
    }

    if (this.filterEnabled('list_volume')) {
      criteria.list_volume.min = this.refs.list_volume_min.refs.input.value
      criteria.list_volume.max = this.refs.list_volume_max.refs.input.value
    }

    criteria.list_value = {
      min: null,
      max: null
    }

    if (this.filterEnabled('list_value')) {
      criteria.list_value.min = this.refs.list_value_min.refs.input.value
      criteria.list_value.max = this.refs.list_value_max.refs.input.value
    }

    criteria.sell_volume = {
      min: null,
      max: null
    }

    if (this.filterEnabled('sell_volume')) {
      criteria.sell_volume.min = this.refs.sell_volume_min.refs.input.value
      criteria.sell_volume.max = this.refs.sell_volume_max.refs.input.value
    }

    criteria.sell_value = {
      min: null,
      max: null
    }

    if (this.filterEnabled('sell_value')) {
      criteria.sell_value.min = this.refs.sell_value_min.refs.input.value
      criteria.sell_value.max = this.refs.sell_value_max.refs.input.value
    }

    criteria.active_volume = {
      min: null,
      max: null
    }

    if (this.filterEnabled('active_volume')) {
      criteria.active_volume.min = this.refs.active_volume_min.refs.input.value
      criteria.active_volume.max = this.refs.active_volume_max.refs.input.value
    }

    criteria.active_value = {
      min: null,
      max: null
    }

    if (this.filterEnabled('active_value')) {
      criteria.active_value.min = this.refs.active_value_min.refs.input.value
      criteria.active_value.max = this.refs.active_value_max.refs.input.value
    }

    criteria.total_active_volume = {
      min: null,
      max: null
    }

    if (this.filterEnabled('total_active_volume')) {
      criteria.total_active_volume.min = this.refs.total_active_volume_min.refs.input.value
      criteria.total_active_volume.max = this.refs.total_active_volume_max.refs.input.value
    }

    criteria.total_active_value = {
      min: null,
      max: null
    }

    if (this.filterEnabled('total_active_value')) {
      criteria.total_active_value.min = this.refs.total_active_value_min.refs.input.value
      criteria.total_active_value.max = this.refs.total_active_value_max.refs.input.value
    }

    criteria.agent_experience = null
    if (this.filterEnabled('total_active_value'))
      criteria.agent_experience = this.refs.agent_experience.refs.input.value

    const user = this.props.data.user
    AppDispatcher.dispatch({
      action: 'get-agent-report',
      criteria,
      user
    })
  }

  filterEnabled(name) {
    const filters = this.props.data.agents.filters
    return {
      display: filters.has(name) ? 'block' : 'none'
    }
  }

  toggle(name) {
    const filters = this.props.data.agents.filters

    if (filters.has(name))
      filters.delete(name)
    else
      filters.add(name)

    AppStore.emitChange()
  }

  years() {
    const options = []
    for (let i = 2008; i <= (new Date()).getFullYear(); i++) {
      options.push((
        <option>{i}</option>
      ))
    }

    return options
  }

  months() {
    const options = []
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]

    for (let i = 1; i <= 12; i++) {
      options.push((
        <option value={i}>{months[i - 1]}</option>
      ))
    }
    return options
  }

  days() {
    const options = []
    for (let i = 1; i <= 31; i++) {
      options.push((
        <option>{i}</option>
      ))
    }
    return options
  }

  render() {
    const s = S('w-49p pull-left pl-5')
    return (
      <div id="filters" style={ S('w-370 pl-80 pt-10 pull-left bg-F5F5F6 p-5') }>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div>
            <label>
              From
            </label>
            <div>
              <Input type="select" ref="from_year" style={ S('w-32p pull-left') }>
                { this.years() }
              </Input>
              <Input type="select" ref="from_day" style={ S('w-32p pull-left ml-1p') }>
                { this.days() }
              </Input>
              <Input type="select" ref="from_month" style={ S('w-32p pull-left ml-1p') }>
                { this.months() }
              </Input>
            </div>
          </div>

          <br/><br/>

          <div>
            <label>
              To
            </label>
            <div>
              <Input type="select" ref="to_year" style={ S('w-32p pull-left') }>
                { this.years() }
              </Input>
              <Input type="select" ref="to_day" style={ S('w-32p pull-left ml-1p') }>
                { this.days() }
              </Input>
              <Input type="select" ref="to_month" style={ S('w-32p pull-left ml-1p') }>
                { this.months() }
              </Input>
            </div>
          </div>

          <br/><br/>


          <div>
            <label>
              Location
            </label>
            <div>
              <Input type="select" placeholder="Area" ref="area">
                <option value="">---</option>
                <option>CEDAR HILL AREA (1)</option>
                <option>DESOTO AREA (2)</option>
                <option>LANCASTER AREA (3)</option>
                <option>WILMER/HUTCHINS AREA (4)</option>
                <option>MESQUITE AREA (5)</option>
                <option>ELLIS COUNTY (6)</option>
                <option>SACHSE/ROWLETT AREA (8)</option>
                <option>THE COLONY AREA (9)</option>
                <option>ADDISON/FAR NORTH DALLAS AREA (10)</option>
                <option>DALLAS NORTH (11)</option>
                <option>DALLAS EAST (12)</option>
                <option>DALLAS SOUTHEAST (13)</option>
                <option>DALLAS NORTH OAK CLIFF (14)</option>
                <option>DALLAS SOUTH OAK CLIFF (15)</option>
                <option>DALLAS NORTHWEST (16)</option>
                <option>DALLAS OAK LAWN (17)</option>
                <option>DALLAS NORTHEAST (18)</option>
                <option>SUNNYVALE AREA (19)</option>
                <option>PLANO AREA (20)</option>
                <option>COPPELL AREA (21)</option>
                <option>CARROLLTON/FARMERS BRANCH AREA (22)</option>
                <option>RICHARDSON AREA (23)</option>
                <option>GARLAND AREA (24)</option>
                <option>UNIVERSITY PARK/HIGHLAND PARK AREA (25)</option>
                <option>IRVING AREA (26)</option>
                <option>DUNCANVILLE AREA (28)</option>
                <option>DENTON COUNTY (31)</option>
                <option>HUNT AREA (33)</option>
                <option>ROCKWALL COUNTY (34)</option>
                <option>KAUFMAN COUNTY (35)</option>
                <option>VAN ZANDT COUNTY (36)</option>
                <option>GRAYSON AREA (37)</option>
                <option>JOHNSON COUNTY (38)</option>
                <option>DENTON COUNTY SOUTHEAST (41)</option>
                <option>HENDERSON COUNTY (42)</option>
                <option>COOKE COUNTY (43)</option>
                <option>HILL COUNTY (44)</option>
                <option>HOPKINS COUNTY (45)</option>
                <option>LAMAR COUNTY (46)</option>
                <option>DELTA COUNTY (47)</option>
                <option>NAVARRO COUNTY (48)</option>
                <option>FRANKLIN COUNTY (49)</option>
                <option>WYLIE AREA (50)</option>
                <option>ALLEN AREA (51)</option>
                <option>LOVEJOY AREA (52)</option>
                <option>MCKINNEY AREA (53)</option>
                <option>PRINCETON AREA (54)</option>
                <option>FRISCO / DENTON COUNTY EAST AREA (55)</option>
                <option>COMMUNITY AREA (56)</option>
                <option>ROYSE CITY AREA (57)</option>
                <option>FARMERSVILLE AREA (58)</option>
                <option>PROSPER AREA (59)</option>
                <option>CELINA AREA (60)</option>
                <option>RAINS COUNTY (61)</option>
                <option>ANNA AREA (63)</option>
                <option>GUNTER ISD (64)</option>
                <option>WHITEWRIGHT AREA (65)</option>
                <option>TRENTON AREA (66)</option>
                <option>BLUE RIDGE AREA (67)</option>
                <option>MELISSA AREA (68)</option>
                <option>LEONARD AREA (69)</option>
                <option>BLAND AREA (70)</option>
                <option>FANNIN AREA (71)</option>
                <option>WISE COUNTY (72)</option>
                <option>HOOD COUNTY (73)</option>
                <option>WOOD COUNTY (74)</option>
                <option>SOMERVELL COUNTY (75)</option>
                <option>PALO PINTO COUNTY (76)</option>
                <option>JACK COUNTY (77)</option>
                <option>ERATH COUNTY (78)</option>
                <option>ANDERSON COUNTY (79)</option>
                <option>ARCHER COUNTY (80)</option>
                <option>COMANCHE COUNTY (81)</option>
                <option>ARLINGTON NORTH (82)</option>
                <option>ARLINGTON NORTHWEST CENTRAL (83)</option>
                <option>ARLINGTON NORTHEAST CENTRAL (84)</option>
                <option>ARLINGTON SOUTHWEST CENTRAL (85)</option>
                <option>ARLINGTON SOUTHEAST CENTRAL (86)</option>
                <option>ARLINGTON SOUTHWEST (87)</option>
                <option>ARLINGTON SOUTHEAST (88)</option>
                <option>ARLINGTON (MANSFIELD) (89)</option>
                <option>ARLINGTON (KENNEDALE) (90)</option>
                <option>HAMILTON COUNTY (91)</option>
                <option>BOSQUE COUNTY (92)</option>
                <option>WICHITA COUNTY (93)</option>
                <option>YOUNG COUNTY (94)</option>
                <option>EASTLAND COUNTY (95)</option>
                <option>MONTAGUE COUNTY (96)</option>
                <option>CLAY COUNTY (97)</option>
                <option>SMITH COUNTY (98)</option>
                <option>STEPHENS COUNTY (99)</option>
                <option>FW (DOWNTOWN) (101)</option>
                <option>FW (SAGINAW/NORTHSIDE) (102)</option>
                <option>FW EAST (104)</option>
                <option>FW-SOUTHEAST (ROSEDALE) (105)</option>
                <option>FW SOUTH (EVERMAN/FOREST HILL) (106)</option>
                <option>FW-CENTRAL WEST & SOUTHWEST(TCU) (107)</option>
                <option>FW CENTRAL WEST (108)</option>
                <option>FW NW(EAGLE MT.LK/RIV.OAKS/AZLE (109)</option>
                <option>FW (SOUTH OF I20/CROWLEY) (111)</option>
                <option>FW FAR WEST-BENBROOK/WH.SETTLEM. (112)</option>
                <option>BEDFORD AREA (120)</option>
                <option>EULESS AREA (121)</option>
                <option>HURST AREA (122)</option>
                <option>COLLEYVILLE AREA (123)</option>
                <option>GRAPEVINE AREA (124)</option>
                <option>SOUTHLAKE AREA (125)</option>
                <option>KELLER AREA (126)</option>
                <option>N RICHLAND HILLS/RICHLAND HILLS AREA (127)</option>
                <option>WATAUGA AREA (128)</option>
                <option>FW-OAKHURST,HALTOM CITY,RIVERSIDE (129)</option>
                <option>FW-NORTH CENTRAL TARRANT COUNTY (130)</option>
                <option>ROANOKE AREA (131)</option>
                <option>TROPHY CLUB/WEST LAKE AREA (132)</option>
                <option>PARKER COUNTY (140)</option>
                <option>PARKER COUNTY (141)</option>
                <option>PARKER COUNTY (142)</option>
                <option>PARKER COUNTY (143)</option>
                <option>PARKER COUNTY (144)</option>
                <option>PARKER COUNTY (145)</option>
                <option>PARKER COUNTY (146)</option>
                <option>PARKER COUNTY (147)</option>
                <option>PARKER COUNTY (148)</option>
                <option>PARKER COUNTY (149)</option>
                <option>PARKER COUNTY (150)</option>
                <option>PARKER COUNTY (151)</option>
                <option>PARKER COUNTY (152)</option>
                <option>PARKER COUNTY (153)</option>
                <option>PARKER COUNTY (154)</option>
                <option>PARKER COUNTY (155)</option>
                <option>MCLENNAN COUNTY (156)</option>
                <option>LIMESTONE COUNTY (157)</option>
                <option>FREESTONE COUNTY (158)</option>
                <option>GRAND PRAIRIE (271)</option>
                <option>GRAND PRAIRIE (272)</option>
                <option>GRAND PRAIRIE (273)</option>
                <option>GRAND PRAIRIE (274)</option>
                <option>GRAND PRAIRIE (275)</option>
                <option>GRAND PRAIRIE (276)</option>
                <option>ABILENE NORTHWEST (301)</option>
                <option>ABILENE NORTHEAST (302)</option>
                <option>ABILENE SOUTHWEST (303)</option>
                <option>ABILENE SOUTHEAST (304)</option>
                <option>TAYLOR COUNTY NW (305)</option>
                <option>TAYLOR COUNTY NE (306)</option>
                <option>TAYLOR COUNTY SW (307)</option>
                <option>TAYLOR COUNTY SE (309)</option>
                <option>STONEWALL COUNTY (320)</option>
                <option>HASKELL COUNTY (321)</option>
                <option>THROCKMORTON COUNTY (322)</option>
                <option>SCURRY COUNTY (323)</option>
                <option>FISHER COUNTY (324)</option>
                <option>JONES COUNTY (325)</option>
                <option>SHACKELFORD COUNTY (326)</option>
                <option>NOLAN COUNTY (327)</option>
                <option>CALLAHAN COUNTY (329)</option>
                <option>RUNNELS COUNTY (330)</option>
                <option>COLEMAN COUNTY (331)</option>
                <option>BROWN COUNTY (332)</option>
                <option>MILLS (333)</option>
                <option>CONCHO (334)</option>
                <option>MCCULLOCH (335)</option>
                <option>SAN SABA (336)</option>
                <option>LAMPASAS (337)</option>
                <option>CORYELL (338)</option>
                <option>COKE (349)</option>
                <option>TOM GREEN COUNTY (350)</option>
                <option>SCHLEICHER (351)</option>
                <option>MENARD (352)</option>
                <option>MASON (353)</option>
                <option>LLANO (354)</option>
                <option>BURNET (355)</option>
                <option>SUTTON (356)</option>
                <option>KIMBLE (357)</option>
                <option>W.OF SVC.AREA - Not incl.Abilene & Taylor Co.(600)</option>
                <option>SOUTH OF SERVICE AREA (700)</option>
                <option>EAST OF SERVICE AREA (800)</option>
                <option>OKLAHOMA (900)</option>
                <option>OTHER AREAS WITHIN THE U.S. (999)</option>
                <option>OUTSIDE OF THE U.S. (1000)</option>
                <option>NTREIS TEST ONLY</option>
              </Input>
            </div>
          </div>

          <div>
            <label>
              <input type="checkbox" onChange={ this.toggle.bind(this, 'list_value') } />
              &nbsp; <span className="listing-side">Listing-side $</span>
            </label>
            <div style={ this.filterEnabled('list_value') }>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Min" ref="list_value_min"/>
              </div>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Max" ref="list_value_max"/>
              </div>
            </div>
          </div>

          <div>
            <label>
              <input type="checkbox" onChange={ this.toggle.bind(this, 'list_volume') } />
              &nbsp; <span className="listing-side">Listing-side #</span>
            </label>
            <div style={ this.filterEnabled('list_volume') }>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Min" ref="list_volume_min"/>
              </div>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Max" ref="list_volume_max"/>
              </div>
            </div>
          </div>

          <div>
            <label>
              <input type="checkbox" onChange={ this.toggle.bind(this, 'sell_value') } />
              &nbsp; <span className="buying-side">Buying-side $</span>
            </label>
            <div style={ this.filterEnabled('sell_value') }>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Min" ref="sell_value_min"/>
              </div>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Max" ref="sell_value_max"/>
              </div>
            </div>
          </div>

          <div>
            <label>
              <input type="checkbox" onChange={ this.toggle.bind(this, 'sell_volume') } />
              &nbsp; <span className="buying-side">Buying-side #</span>
            </label>
            <div style={ this.filterEnabled('sell_volume') }>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Min" ref="sell_volume_min"/>
              </div>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Max" ref="sell_volume_max"/>
              </div>
            </div>
          </div>

          <div>
            <label title="Sum of value of active listings this agent currently has (In the area you searched for)">
              <input type="checkbox" onChange={ this.toggle.bind(this, 'active_value') } />
              &nbsp; <span className="listing-side">Active listings $</span>
              <span className="tip">
                Limited to searched area
              </span>
            </label>
            <div style={ this.filterEnabled('active_value') }>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Min" ref="active_value_min"/>
              </div>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Max" ref="active_value_max"/>
              </div>
            </div>
          </div>

          <div>
            <label title="Number of active listings this agent currently has (In the area you searched for)">
              <input type="checkbox" onChange={ this.toggle.bind(this, 'active_volume') } />
              &nbsp; <span className="listing-side">Active Listings #</span>
              <span className="tip">
                Limited to searched area
              </span>
            </label>
            <div style={ this.filterEnabled('active_volume') }>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Min" ref="active_volume_min"/>
              </div>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Max" ref="active_volume_max"/>
              </div>
            </div>
          </div>

          <div>
            <label title="Sum of value of active listings this agent currently has (Not limited to current area)">
              <input type="checkbox" onChange={ this.toggle.bind(this, 'total_active_value') } />
              &nbsp; <span className="listing-side">Total Active $</span>
              <span className="tip">
                Not limited to searched area
              </span>
            </label>
            <div style={ this.filterEnabled('total_active_value') }>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Min" ref="total_active_value_min"/>
              </div>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Max" ref="total_active_value_max"/>
              </div>
            </div>
          </div>

          <div>
            <label title="Number of active listings this agent currently has (Not limited to current area)">
              <input type="checkbox" onChange={ this.toggle.bind(this, 'total_active_volume') } />
              &nbsp; <span className="listing-side">Total Active #</span>
              <span className="tip">
                Not limited to searched area
              </span>
            </label>
            <div style={ this.filterEnabled('total_active_volume') }>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Min" ref="total_active_volume_min"/>
              </div>
              <div style={ s }>
                <Input type="text" bsSize="small" placeholder="Max" ref="total_active_volume_max"/>
              </div>
            </div>
          </div>

          <div>
            <label>
              <input type="checkbox" onChange={ this.toggle.bind(this, 'agent_experience') } />
              &nbsp; Agent Experience
              <span className="tip">
                Guessed based on MLSID
              </span>
            </label>
            <div style={ this.filterEnabled('agent_experience') }>
              <Input type="select" ref="agent_experience">
                <option value="">---</option>
                <option value="0-5">0-5 Years</option>
                <option value="5-10">5-10 Years</option>
                <option value="10-15">10-15 Years</option>
                <option value="15-25">15-25 Years</option>
                <option value="25-40">25-40 Years</option>
                <option value="20+">20+</option>
              </Input>
            </div>
          </div>

          <br/> <br/>

          <Input type="submit" value="Show results"/>
        </form>
      </div>
    )
  }
}

// PropTypes
FilterBar.propTypes = {
  data: React.PropTypes.object.isRequired
}