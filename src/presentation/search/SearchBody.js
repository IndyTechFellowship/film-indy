import React from 'react'
import { Link } from 'react-router-dom'
import QueryString from 'query-string'
import { Card, CardMedia, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import { GridList } from 'material-ui/GridList'
import MasonryInfiniteScroller from 'react-masonry-infinite'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { get, take } from 'lodash'
import PropTypes from 'prop-types'

const SearchBody = ({ enriched, enrichedVendors, enrichedLocations, location, totalHits, totalVendorHits, totalLocationHits, searchForCrew, searchForVendors, searchForLocations, offset, length, history }) => {
  const parsed = QueryString.parse(location.search)
  const query = get(parsed, 'query', ' ')
  const showOnly = get(parsed, 'show', 'all')
  const rolesToFilter = get(parsed, 'role', [])
  const locationTypesToFilter = get(parsed, 'locationType', [])
  const roleFilters = typeof (rolesToFilter) === 'string' ? [{ type: 'role', role: rolesToFilter }] : rolesToFilter.map(role => ({
    type: 'role',
    role
  }))
  const locationTypeFilters = typeof (locationTypesToFilter) === 'string' ? [{ type: 'location', locationType: locationTypesToFilter }] : locationTypesToFilter.map(locationType => ({
    type: 'location',
    locationType
  }))
  const expMin = get(parsed, 'expMin')
  const expMax = get(parsed, 'expMax')
  const parsedExpMin = expMin ? Number.parseInt(expMin, 10) : undefined
  const parsedExpMax = expMax ? Number.parseInt(expMax, 10) : undefined
  const experienceFilter = { min: parsedExpMin, max: parsedExpMax }

  if (enriched.length === 0 && totalHits.hasLoaded && enrichedVendors.length === 0 && totalVendorHits.hasLoaded && enrichedLocations.length === 0 && totalLocationHits.hasLoaded) {
    return (
      <div style={{ marginTop: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 200 }}>  Yikes! Your search didn't return any results. Try searching for a media specialist role or a name. </h2>
      </div>
    )
  }
  if (showOnly === 'all') {
    if ((totalHits.hasLoaded && enriched.length > 0) || (totalVendorHits.hasLoaded && enrichedVendors.length > 0) || (totalLocationHits.hasLoaded && enrichedLocations.length > 0)) {
      return (
        <Grid fluid style={{ padding: 0 }}>
          <div>
            { enriched.length > 0 ? (
              <div>
                <Row>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20, paddingTop: 20 }}>
                    <Col xs>
                      <h1 style={{ textAlign: 'left', paddingLeft: 40, margin: 0 }}> Crew </h1>
                    </Col>
                    {showOnly === 'all' ?
                      <Row end="xs">
                        <Col xs={2}>
                          <RaisedButton
                            label="See More"
                            labelColor="white"
                            labelStyle={{ paddingLeft: 5, paddingRight: 5 }}
                            backgroundColor={'#38b5e6'}
                            onClick={() => {
                              const newQs = QueryString.stringify({ ...parsed, show: 'crew' })
                              history.push({ pathname: '/search', search: newQs })
                            }}
                          />
                        </Col>
                      </Row>
                      : null }
                  </div>
                </Row>

                <Row style={{ overflowX: 'auto' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                    <GridList style={{ display: 'flex', flexWrap: 'nowrap' }} padding={4}>
                      {take(enriched, 4).map((enrichedResult, i) => (

                        <Link key={enrichedResult.objectID} to={{ pathname: '/profile', search: `?query=${encodeURIComponent(get(enrichedResult, 'objectID'))}` }} style={{ width: 'inherit' }}>
                          <Card containerStyle={{ paddingBottom: 0, display: 'flex', flexDirection: 'row' }} style={{ width: 400, height: 150, marginRight: 20, borderRadius: 10, marginLeft: i === 0 ? 30 : 0 }}>
                            <CardMedia>
                              <img src={get(enrichedResult, 'photoURL', 'http://sunfieldfarm.org/wp-content/uploads/2014/02/profile-placeholder.png')} alt="" style={{ width: 150, height: 150, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }} />
                            </CardMedia>

                            <div>
                              <CardText style={{ fontSize: 25 }}>
                                {`${get(enrichedResult, 'firstName', '')} ${get(enrichedResult, 'lastName', '')}`}
                              </CardText>
                              <CardText>
                                {get(enrichedResult, 'headline', '')}
                              </CardText>
                            </div>

                          </Card>
                        </Link>

                      ))}
                    </GridList>
                  </div>
                </Row>

              </div>
            ) : null }
            {enrichedVendors.length !== 0 ? (
              <div>
                <Row>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20, paddingTop: 20 }}>
                    <Col xs>
                      <h1 style={{ textAlign: 'left', paddingLeft: 40, margin: 0 }}> Vendors </h1>
                    </Col>
                    {showOnly === 'all' ?
                      <Row end="xs">
                        <Col xs={2}>
                          <RaisedButton
                            label="See More"
                            labelColor="white"
                            labelStyle={{ paddingLeft: 5, paddingRight: 5 }}
                            backgroundColor={'#38b5e6'}
                            onClick={() => {
                              const newQs = QueryString.stringify({ ...parsed, show: 'vendors' })
                              history.push({ pathname: '/search', search: newQs })
                            }}
                          />
                        </Col>
                      </Row>
                      : null }
                  </div>
                </Row>

                <Row style={{ overflowX: 'auto' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <GridList style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', overflowY: 'hidden', minHeight: 250 }} padding={4}>
                      {take(enrichedVendors, 8).map((enrichedResult, i) => (

                        <div key={enrichedResult.objectID} style={{ display: 'flex', flexDirection: 'column' }}>
                          <Link to={{ pathname: `/vendor/${enrichedResult.objectID}` }} style={{ display: 'block', margin: 'auto' }}>
                            <Card containerStyle={{ paddingBottom: 0, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} style={{ width: 200, height: 150, marginRight: 20, borderRadius: 10, marginLeft: i === 0 ? 30 : 0 }}>
                              <CardMedia>
                                <img src={get(enrichedResult, 'profileImage', 'https://images.vexels.com/media/users/3/144866/isolated/preview/927c4907bbd0598c70fb79de7af6a35c-business-building-silhouette-by-vexels.png')} alt="" style={{ width: 200, height: 150, borderRadius: 10, objectFit: 'fill' }} />
                              </CardMedia>
                            </Card>
                          </Link>
                          <h3 style={{ textAlign: 'center', width: '100%', marginLeft: enrichedVendors.length === 1 ? 50 : 0 }}> {`${get(enrichedResult, 'vendorName', '')}`} </h3>
                        </div>

                      ))}
                    </GridList>
                  </div>
                </Row>

              </div>
            ) : null
            }

            {enrichedLocations.length !== 0 ? (
              <div>
                <Row>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20, paddingTop: 20 }}>
                    <Col xs>
                      <h1 style={{ textAlign: 'left', paddingLeft: 40, margin: 0 }}> Locations </h1>
                    </Col>
                    {showOnly === 'all' ?
                      <Row end="xs">
                        <Col xs={2}>
                          <RaisedButton
                            label="See More"
                            labelColor="white"
                            labelStyle={{ paddingLeft: 5, paddingRight: 5 }}
                            backgroundColor={'#38b5e6'}
                            onClick={() => {
                              const newQs = QueryString.stringify({ ...parsed, show: 'locations' })
                              history.push({ pathname: '/search', search: newQs })
                            }}
                          />
                        </Col>
                      </Row>
                      : null }
                  </div>
                </Row>

                <Row style={{ overflowX: 'auto' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <GridList style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', overflowY: 'hidden', minHeight: 250 }} padding={4}>
                      {take(enrichedLocations, 4).map((enrichedResult, i) => (

                        <div key={enrichedResult.objectID} style={{ display: 'flex', flexDirection: 'column' }}>
                          <Link to={{ pathname: `/location/${enrichedResult.objectID}` }} style={{ display: 'block', margin: 'auto' }}>
                            <Card
                              key={enrichedResult.objectID}
                              containerStyle={{ paddingBottom: 0, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                              style={{ width: 300, height: 200, marginRight: 20, borderRadius: 10, marginLeft: i === 0 ? 30 : 0 }}
                            >
                              <CardMedia>
                                <img src={get(enrichedResult, 'displayImages[0].url', 'https://images.vexels.com/media/users/3/144866/isolated/preview/927c4907bbd0598c70fb79de7af6a35c-business-building-silhouette-by-vexels.png')} alt="" style={{ width: 300, height: 200, borderRadius: 10, objectFit: 'fill' }} />
                              </CardMedia>
                            </Card>
                          </Link>
                          <h3 style={{ textAlign: 'center', width: '100%', marginLeft: enrichedLocations.length === 1 ? 90 : 0 }}> {`${get(enrichedResult, 'locationName', '')}`} </h3>
                        </div>

                      ))}
                    </GridList>
                  </div>
                </Row>

              </div>
            ) : null
            }
          </div>
        </Grid>
      )
    } else if (totalHits.hasLoaded && enriched.length === 0 && enrichedVendors.length === 0 && totalVendorHits.hasLoaded && enrichedLocations.length === 0 && totalLocationHits.hasLoaded) {
      return (
        <div style={{ marginTop: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ fontWeight: 200 }}>  Yikes! Your search didn't return any results. Try searching for a media specialist role or a name. </h2>
        </div>
      )
    }
  } else if (showOnly === 'crew') {
    const hasMore = totalHits.hasLoaded && (totalHits.profiles !== 0 || totalHits.names !== 0)
    return (
      <div style={{ marginTop: 15 }}>
        <MasonryInfiniteScroller
          hasMore
          sizes={[
            { columns: 1, gutter: 5 },
            { columns: 2, mq: '900px', gutter: 100 },
            { columns: 3, mq: '1330px', gutter: 40 },
            { columns: 4, mq: '1900px', gutter: 40 },
            { columns: 5, mq: '2500px', gutter: 40 }
          ]}
          pageStart={1}
          loadMore={() => {
            if (hasMore) {
              searchForCrew(query, roleFilters, experienceFilter, offset + length)
            }
          }}
        >
          {enriched.map(enrichedResult => (
            <Card
              onClick={() => {
                history.push({ pathname: '/profile', search: `?query=${encodeURIComponent(get(enrichedResult, 'objectID'))}` })
              }}
              key={enrichedResult.objectID}
              containerStyle={{ paddingBottom: 0, display: 'flex', flexDirection: 'row' }}
              style={{ width: 400, height: 150, marginRight: 20, marginBottom: 10, borderRadius: 10, marginLeft: 30, cursor: 'pointer' }}
            >
              <CardMedia>
                <img src={get(enrichedResult, 'photoURL', 'http://sunfieldfarm.org/wp-content/uploads/2014/02/profile-placeholder.png')} alt="" style={{ objectFit: 'cover', width: 150, height: 150, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }} />
              </CardMedia>
              <div>
                <CardText style={{ fontSize: 25 }}>
                  {`${get(enrichedResult, 'firstName', '')} ${get(enrichedResult, 'lastName', '')}`}
                </CardText>
                <CardText>
                  {get(enrichedResult, 'headline', '')}
                </CardText>
              </div>
            </Card>
          ))}
        </MasonryInfiniteScroller>
      </div>
    )
  } else if (showOnly === 'vendors') {
    const hasMore = totalVendorHits.hasLoaded && totalVendorHits.vendors !== 0
    return (
      <div style={{ marginTop: 15 }}>
        <MasonryInfiniteScroller
          hasMore
          sizes={[
            { columns: 1, gutter: 5 },
            { columns: 2, mq: '900px', gutter: 100 },
            { columns: 3, mq: '1330px', gutter: 70 },
            { columns: 4, mq: '1900px', gutter: 70 },
            { columns: 5, mq: '2500px', gutter: 70 }
          ]}
          pageStart={1}
          loadMore={() => {
            if (hasMore) {
              searchForVendors(query, offset + length)
            }
          }}
        >
          {enrichedVendors.map(enrichedResult => (
            <div style={{ width: 200, marginLeft: 30 }}>
              <Card
                onClick={() => {
                  history.push({ pathname: `/vendor/${enrichedResult.objectID}` })
                }}
                key={enrichedResult.objectID}
                containerStyle={{ paddingBottom: 0, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                style={{ width: 200, height: 150, marginRight: 10, borderRadius: 10, cursor: 'pointer', display: 'block' }}
              >
                <CardMedia>
                  <img src={get(enrichedResult, 'photoURL', 'https://images.vexels.com/media/users/3/144866/isolated/preview/927c4907bbd0598c70fb79de7af6a35c-business-building-silhouette-by-vexels.png')} alt="" style={{ width: 150, height: 150, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }} />
                </CardMedia>
              </Card>
              <h4 style={{ textAlign: 'center', width: '100%' }}> {`${get(enrichedResult, 'vendorName', '')}`} </h4>
            </div>
          ))}
        </MasonryInfiniteScroller>
      </div>
    )
  } else if (showOnly === 'locations') {
    const hasMore = totalLocationHits.hasLoaded && totalLocationHits.locations !== 0
    return (
      <div style={{ marginTop: 15 }}>
        <MasonryInfiniteScroller
          hasMore
          sizes={[
            { columns: 1, gutter: 5 },
            { columns: 2, mq: '900px', gutter: 100 },
            { columns: 3, mq: '1330px', gutter: 70 },
            { columns: 4, mq: '1900px', gutter: 70 },
            { columns: 5, mq: '2500px', gutter: 70 }
          ]}
          pageStart={1}
          loadMore={() => {
            if (hasMore) {
              searchForLocations(query, locationTypeFilters, offset + length)
            }
          }}
        >
          {enrichedLocations.map(enrichedResult => (
            <div key={enrichedResult.locationName}style={{ width: 300 }}>
              <Card
                onClick={() => {
                  history.push({ pathname: `/location/${enrichedResult.objectID}` })
                }}
                key={enrichedResult.objectID}
                containerStyle={{ paddingBottom: 0, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                style={{ width: 300, height: 200, marginRight: 20, borderRadius: 10, marginLeft: 30, cursor: 'pointer' }}
              >
                <CardMedia>
                  <img src={get(enrichedResult, 'displayImages[0].url', 'https://images.vexels.com/media/users/3/144866/isolated/preview/927c4907bbd0598c70fb79de7af6a35c-business-building-silhouette-by-vexels.png')} alt="" style={{ width: 300, height: 200, borderRadius: 10 }} />
                </CardMedia>
              </Card>
              <h4 style={{ textAlign: 'center', width: '100%', marginLeft: enrichedLocations.length === 1 ? 90 : 0 }}> {`${get(enrichedResult, 'locationName', '')}`} </h4>
            </div>
          ))}
        </MasonryInfiniteScroller>
      </div>
    )
  }
  return (
    <div> {' '} </div>
  )
}

SearchBody.propTypes = {
  searchForCrew: PropTypes.func.isRequired,
  searchForVendors: PropTypes.func.isRequired,
  searchForLocations: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  enriched: PropTypes.arrayOf(PropTypes.object).isRequired,
  enrichedVendors: PropTypes.arrayOf(PropTypes.object).isRequired,
  enrichedLocations: PropTypes.arrayOf(PropTypes.object).isRequired,
  offset: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  totalHits: PropTypes.shape({
    hasLoaded: PropTypes.bool.isRequired,
    profiles: PropTypes.number,
    names: PropTypes.number
  }).isRequired,
  totalVendorHits: PropTypes.shape({
    hasLoaded: PropTypes.bool.isRequired,
    vendors: PropTypes.number
  }).isRequired,
  totalLocationHits: PropTypes.shape({
    hasLoaded: PropTypes.bool.isRequired,
    locations: PropTypes.number
  }).isRequired
}

export default SearchBody
