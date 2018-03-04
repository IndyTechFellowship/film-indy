import React from 'react'
import '../../App.css'
import './homePage.css'
import PropTypes from 'prop-types'

import { InstantSearch, Index, CurrentRefinements, Configure } from 'react-instantsearch/dom'
import { connectAutoComplete, connectMenu } from 'react-instantsearch/connectors'
import { Grid, Row, Col } from 'react-flexbox-grid'

import ImageSlider from 'react-slick'
import { Link } from 'react-router-dom'
import Autosuggest from 'react-autosuggest'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import { get } from 'lodash'

// Image imports
import LocationsImage from './location5.jpg'
import CrewImage from './crew1.jpg'
import VendorsImage from './vendors4.jpg'

import ProdAsstImage from './crew3.jpg'
import CameraAsstImage from './crew4.jpg'
import PostProdImage from './crew7.jpg'
import CinImage from './crew5.jpg'
import ProdWriterImage from './bg1.jpg'
import LightingImage from './location4.jpg'
import CamDirImage from './vendors3.jpg'
import DirImage from './director.jpg'
import AudioOpImage from './crew8.jpg'
import ProdPhotoImage from './crew9.jpg'
import ScoutImage from './scout.jpg'


// Material UI component imports
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

// Material UI SVG Icons
import SearchIcon from 'material-ui/svg-icons/action/search'

const VirtualMenu = connectMenu(() => null)

const styles = {
  container: {
    flexGrow: 1,
    position: 'relative',
    paddingTop: 3
  },
  suggestionsContainerOpen: {
    zIndex: 2,
    position: 'absolute',
    marginTop: 1,
    marginBottom: 1 * 3,
    left: 0,
    right: 0
  },
  sectionTitle: {
    backgroundColor: '#fff'
  },
  suggestion: {
    display: 'block'
  },
  suggestionHiglighted: {
    opacity: 1
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    backgroundColor: '#fff'
  },
  textField: {
    width: '100%'
  }
}

const ALGOLIA_SEARCH_KEY = process.env.REACT_APP_ALGOLIA_SEARCH_KEY
const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID

const AutoCompleteBar = connectAutoComplete(
  ({ hits, currentRefinement, refine, onUpdateInput, onSuggestionClicked, onEnterHit }) => {
    const subsetHits = hits.map(hit => ({ ...hit, hits: hit.hits.slice(0, 3) }))
    return (
      <Autosuggest
        theme={styles}
        suggestions={subsetHits}
        multiSection
        onSuggestionsFetchRequested={({ value }) => refine(value)}
        onSuggestionsClearRequested={() => refine('')}
        getSuggestionValue={hit => hit.roleName}
        onSuggestionSelected={(event, { suggestion, sectionIndex }) => {
          onSuggestionClicked(suggestion, sectionIndex)
        }}
        renderInputComponent={(inputProps) => {
          const onBlur = (event) => {
            inputProps.onBlur()
            refine(currentRefinement)
          }
          const moreInputProps = { ...inputProps, onBlur }
          return (
            <TextField
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  onEnterHit()
                }
              }}
              id="autocomplete-text-field"
              {...moreInputProps}
            />
          )
        }}
        renderSuggestion={(hit) => {
          if (hit.roleName) {
            return (
              <MenuItem
                style={{ whiteSpace: 'inital' }}
              >
                {hit.roleName}
              </MenuItem>
            )
          } else if (hit.firstName || hit.lastName) {
            return (
              <MenuItem style={{ whiteSpace: 'inital' }}>
                {`${get(hit, 'firstName', '')} ${get(hit, 'lastName', '')}`}
              </MenuItem>
            )
          } else if (hit.vendorName) {
            return (
              <MenuItem style={{ whiteSpace: 'inital' }}>
                {`${hit.vendorName}`}
              </MenuItem>
            )
          } else if (hit.locationName) {
            return (
              <MenuItem style={{ whiteSpace: 'inital' }}>
                {`${hit.locationName}`}
              </MenuItem>
            )
          } else if (hit.type) {
            return (
              <MenuItem style={{ whiteSpace: 'inital' }}>
                {`${hit.type}`}
              </MenuItem>
            )
          }
          return (null)
        }}
        renderSectionTitle={(section) => {
          if (section.hits.length > 0) {
            if (section.index === 'roles') {
              return (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <strong>Roles</strong>
                </div>
              )
            } else if (section.index === 'names') {
              return (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <strong>Crew</strong>
                </div>
              )
            } else if (section.index === 'vendors') {
              return (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <strong>Vendors</strong>
                </div>
              )
            } else if (section.index === 'locations') {
              return (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <strong>Locations</strong>
                </div>
              )
            } else if (section.index === 'locationTypes') {
              return (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <strong>Locations Types</strong>
                </div>
              )
            }
          }
          return ''
        }}
        renderSuggestionsContainer={({ containerProps, children }) => (
          <Card {...containerProps}>
            {children}
          </Card>
        )}
        getSectionSuggestions={section => section.hits}
        inputProps={{
          placeholder: 'Search our database....',
          style: {
            height: 42,
            width: '41.5em'
          },
          value: currentRefinement,
          onChange: (event) => {
            onUpdateInput(event.target.value)
          }
        }}
      />
    )
  })

const categories = [
  { key: 0, image: LocationsImage, title: 'Locations' },
  { key: 1, image: CrewImage, title: 'Crew' },
  { key: 2, image: VendorsImage, title: 'Vendors' }
]

const roles = [
  { key: 0, image: ProdAsstImage, title: 'Production Assistant' },
  { key: 1, image: CameraAsstImage, title: 'Camera Assistant' },
  { key: 2, image: PostProdImage, title: 'Post Production Editor' },
  { key: 3, image: ProdWriterImage, title: 'Production Writer' },
  { key: 4, image: CinImage, title: 'Cinematographer' },
  { key: 5, image: LightingImage, title: 'Lighting Grip' },
  { key: 6, image: CamDirImage, title: 'Camera Director' },
  { key: 7, image: DirImage, title: 'Director' },
  { key: 8, image: AudioOpImage, title: 'Audio Boom Operator' },
  { key: 9, image: ProdPhotoImage, title: 'Production Photographer' },
  { key: 10, image: ScoutImage, title: 'Location Scout' }
]

const generateCategorySearchLink = (index) => {
  if (index === 0) {
    return '/search?query=%27%27&show=locations'
  } else if (index === 1) {
    return '/search?query=%27%27&show=crew'
  } else if (index === 2) {
    return '/search?query=%27%27&show=vendors'
  }
  return '/search?query=%27%27&show=all'
}

class homePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { searchQuery: '' }
  }
  render() {
    const { history } = this.props
    const { searchQuery } = this.state
    const sliderSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      swipeToSlide: true,
      slidesToShow: 6,
      slidesToScroll: 2,
      nextArrow: <Arrow direction="nextArrow" />,
      prevArrow: <Arrow direction="prevArrow" />,
      responsive: [
        { breakpoint: 400, settings: { slidesToShow: 1, centerMode: true, slidesToScroll: 1, dots: false } },
        { breakpoint: 768, settings: { slidesToShow: 3 } },
        { breakpoint: 1024, settings: { slidesToShow: 5 } }
      ]
    }
    return (
      <div className="home-container">
        <div className="bg-image">
          <div className="header-wrapper">
            <div className="main-header">Film Indy</div>
            <div className="subheader">If it isn't on video,</div>
            <div className="subheader">it didn't happen.</div>
            <Card className="searchCard">
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <SearchIcon className="searchIcon" />
                <InstantSearch
                  appId={ALGOLIA_APP_ID}
                  apiKey={ALGOLIA_SEARCH_KEY}
                  indexName="roles"
                >
                  <Index indexName="names">
                    <Configure />
                    <CurrentRefinements
                      transformItems={items => items.filter(item => item.public === 'true' || item.public === 'false')}
                    />
                    <VirtualMenu attributeName="public" defaultRefinement={'true'} />
                  </Index>
                  <Index indexName="vendors">
                    <Configure />
                    <CurrentRefinements
                      transformItems={items => items.filter(item => item.public === 'true' || item.public === 'false')}
                    />
                    <VirtualMenu attributeName="public" defaultRefinement={'true'} />
                  </Index>
                  <Index indexName="locations">
                    <Configure />
                    <CurrentRefinements
                      transformItems={items => items.filter(item => item.public === 'true' || item.public === 'false')}
                    />
                    <VirtualMenu attributeName="public" defaultRefinement={'true'} />
                  </Index>
                  <Index indexName="locationTypes" />
                  <AutoCompleteBar
                    onEnterHit={() => {
                      if (searchQuery) {
                        history.push({ pathname: '/search', search: `?query=${encodeURIComponent(searchQuery)}&show=all` })
                      }
                    }}
                    onUpdateInput={query => this.setState({ searchQuery: query })}
                    onSuggestionClicked={(suggestion, index) => {
                      if (index === 0) {
                        history.push({ pathname: '/search', search: `?query=''&show=crew&role=${encodeURIComponent(suggestion.roleName)}` })
                      } else if (index === 1) {
                        history.push({ pathname: '/profile', search: `?query=${encodeURIComponent(suggestion.objectID)}` })
                      } else if (index === 2) {
                        history.push({ pathname: `/vendor/${suggestion.objectID}` })
                      } else if (index === 3) {
                        history.push({ pathname: `/location/${suggestion.objectID}` })
                      } else if (index === 4) {
                        history.push({ pathname: '/search', search: `?query=''&show=locations&locationType=${encodeURIComponent(suggestion.type)}` })
                      }
                    }}
                  />
                </InstantSearch>
              </div>
              <RaisedButton
                primary
                label="Search"
                style={{ display: 'inline' }}
                onClick={() => {
                  if (searchQuery && searchQuery !== '') {
                    history.push({ pathname: '/search', search: `?query=${encodeURIComponent(searchQuery)}&show=all` })
                  } else {
                    history.push({ pathname: '/search', search: `?query=${encodeURIComponent('')}&show=all` })
                  }
                }}
              />
            </Card>
          </div>
        </div>

        <div className="category-wrapper header">
          <div className="header">Explore Indy</div>
        </div>
        <Grid fluid style={{ padding: 0 }} className="category-wrapper">
          <Row>
            {
              categories.map(item => (
                <Col xs key={item.key}>
                  <Card className="category-card">
                    <Link to={generateCategorySearchLink(item.key)}>
                      <CardMedia>
                        <img src={item.image} alt="Explore Categories" style={{ objectFit: 'cover' }} />
                      </CardMedia>
                      <CardTitle title={item.title} />
                    </Link>
                  </Card>
                </Col>))
            }
          </Row>
        </Grid>

        <div className="roles-wrapper header">
          <div className="header">Popular Roles</div>
        </div>
        <div className="roles-wrapper">
          <ImageSlider className="imageSlider" {...sliderSettings}>
            {
              roles.map(item => (
                <Card className="category-card" key={item.key}>
                  <Link to={`/search?query=${encodeURIComponent(item.title)}&show=all`} style={{ textDecoration: 'none' }}>
                    <CardMedia>
                      <img src={item.image} alt="Explore Roles" style={{ objectFit: 'cover' }} />
                    </CardMedia>
                    <CardText className="popular-roles-text">{item.title}</CardText>
                  </Link>
                </Card>))
            }
          </ImageSlider>
        </div>
      </div>
    )
  }
}


const Arrow = ({ className, style, onClick, direction }) => (
  <button
    className={[className, direction].join(' ')}
    style={{ ...style }}
    onClick={onClick}
  />
)


homePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
}

homePage.defaultProps = {
}

export default homePage
