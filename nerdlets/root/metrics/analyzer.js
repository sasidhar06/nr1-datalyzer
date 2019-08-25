import React from "react"
import { Stack, StackItem, Grid, GridItem } from 'nr1'

import MetricPicker from './metric-picker'
import DimensionPicker from '../shared/dimension-picker'
import FunctionPicker from './function-picker'
import Chart from './chart'
import FacetTable from './facet-table'
import Filters from '../shared/filters'
import {getFilterWhere} from './get-metric-query'
import Header from './header'

export default class Analyzer extends React.Component {
  constructor(props) {
    super(props)

    this._setAttribute = this._setAttribute.bind(this)
    this._setDimension = this._setDimension.bind(this)
    this._setFunction = this._setFunction.bind(this)
    this._setFilter = this._setFilter.bind(this)
    this._removeFilter = this._removeFilter.bind(this)

    this.state ={ fn: 'average', filters: {}, filterWhere: null, eventType: this.props.eventType }
  }

  onStateChange(prevProps) {
    if(prevProps.account.id != this.props.account.id) {
      this.setState({dimension: null, filters: {}, attribute: null})
    }
  }

  _setAttribute(metricName) {
    this.setState({ metricName, attribute: metricName, filters: {}, filterWhere: null })
  }

  _setDimension(dimension) {
    this.setState({ dimension })
  }

  _setFunction(fn) {
    this.setState({fn})
  }

  _setFilter(dimension, value) {
    const {filters} = this.state
    filters[dimension] = filters[dimension] || []
    if(!filters[dimension].includes(value)) filters[dimension].push(value)

    const filterWhere = getFilterWhere(filters)
    this.setState({filters, filterWhere})
  }

  _removeFilter(attribute, value) {
    const {filters} = this.state
    filters[attribute] = filters[attribute].filter(v => v !== value)

    // if there are no more values on this attribute, delete the empty array
    if(filters[attribute].length == 0) delete filters[attribute]

    this.setState({filters})
  }

  render() {
    return <Stack directionType="vertical" alignmentType="fill">
      <StackItem>
        <Header {...this.props} {...this.state} setAttribute={this._setAttribute} setFunction={this._setFunction} />
      </StackItem>
      <StackItem>
        <Filters {...this.props} {...this.state} removeFilter={this._removeFilter} />
      </StackItem>
      <StackItem alignmentType="trailing" fill>
        <Grid>
          <GridItem columnSpan={3}>
            <DimensionPicker {...this.props} {...this.state} setDimension={this._setDimension} />
          </GridItem>
          <GridItem columnSpan={9}>
            <Stack directionType="vertical" alignmentType="fill">
              <StackItem>
                <Chart {...this.props} {...this.state} />
              </StackItem>
              <StackItem>
                <FacetTable {...this.props} {...this.state} setFilter={this._setFilter} />
              </StackItem>
            </Stack>
          </GridItem>
        </Grid>
      </StackItem>
    </Stack>
  }
}