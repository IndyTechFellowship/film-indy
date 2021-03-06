import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SearchPage from '../../presentation/search/Search'
import * as algoliaActions from '../../redux/actions/creators/algoliaActions'

class Search extends React.Component {
  render() {
    return (
      <SearchPage {...this.props} />
    )
  }
}

Search.propTypes = {
  browser: PropTypes.shape({
    mediaType: PropTypes.string.isRequired
  }).isRequired,
  searchIndex: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  enriched: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default withRouter(connect(
  state => ({
    browser: state.browser,
    profileIndex: state.algolia.crewQueryResults,
    enriched: state.algolia.enrichedCrewResults,
    enrichedVendors: state.algolia.enrichedVendorQueryResults,
    enrichedLocations: state.algolia.enrichedLocationQueryResults,
    offset: state.algolia.offset,
    length: state.algolia.length,
    totalVendorHits: state.algolia.totalVendorHits,
    totalLocationHits: state.algolia.totalLocationHits,
    roleFilters: state.algolia.roleFilters,
    locationTypeFilters: state.algolia.locationTypeFilters,
    experienceFilter: state.algolia.experienceFilter,
    totalHits: state.algolia.totalHits }),
  { ...algoliaActions },
)(Search))
