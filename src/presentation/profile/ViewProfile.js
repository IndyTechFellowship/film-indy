import React from 'react'
import QueryString from 'query-string'
import { Card, CardMedia, CardText, CardTitle, CardActions } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import { Link } from 'react-router-dom'
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import formatLink from '../../util/formatLink'
import { Grid, Row, Col } from 'react-flexbox-grid'
import '../../App.css'
import './ViewProfile.css'

const defaultImage = 'http://sunfieldfarm.org/wp-content/uploads/2014/02/profile-placeholder.png'

function formatPhoneNumber(s) {
  const s2 = (`${s}`).replace(/\D/g, '')
  const m = s2.match(/^(\d{3})(\d{3})(\d{4})$/)
  return (!m) ? null : `(${m[1]}) ${m[2]}-${m[3]}`
}

function linkToEmbed(link, type) {
  if (link) {
    switch (type) {
      case 1:
        const youtubeRegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
        const youtubeMatch = link.match(youtubeRegExp)
        const youtubeVideoID = youtubeMatch[7]

        return `https://www.youtube.com/embed/${youtubeVideoID}`

      case 2:
        // Source: http://jsbin.com/asuqic/184/edit?html,js,output
        const vimeoRegExp = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/
        const vimeoMatch = link.match(vimeoRegExp)
        const vimeoVideoID = vimeoMatch[3]

        return `https://player.vimeo.com/video/${vimeoVideoID}?color=ffffff&portrait=0`

      default:
        return ''
    }
  } else {
    return ''
  }
}

class ViewProfile extends React.Component {
  render() {
    const { data, location, auth } = this.props

    // gets uid of current public profile from URL
    const parsed = QueryString.parse(location.search)
    const uid = parsed.query
    const authorizedUid = get(auth, 'uid')

    // grabs data using uid to populate page
    const roles = get(data, 'roles', {})
    const userProfile = get(data, `userProfiles.${uid}`)
    const userAccount = get(data, `userAccount.${uid}`)

    const userRoles = get(userProfile, 'roles', [])
      .map(roleId => ({ roleName: get(roles, `${roleId}.roleName`, ''), roleId }))
      .sort((a, b) => {
        const aCaps = a.roleName.toUpperCase()
        const bcaps = b.roleName.toUpperCase()
        if (aCaps < bcaps) {
          return -1
        } else if (aCaps > bcaps) {
          return 1
        }
        return 0
      })

    const userLinks = get(userProfile, 'links', [])
    const userCredits = get(userProfile, 'credits', [])
    const bio = get(userProfile, 'bio')
    const experience = get(userProfile, 'experience')
    const currentDate = new Date()
    const numYears = currentDate.getFullYear() - experience
    const headline = get(userProfile, 'headline')
    const video = get(userProfile, 'video', '')[0]
    let videoType = 0
    if (video) videoType = video.url.indexOf('youtube') > -1 ? 1 : 2 // 1 for Youtube, 2 for Vimeo

    const profileImageUrl = get(userAccount, 'photoURL', defaultImage)
    const name = `${get(userAccount, 'firstName', '')} ${get(userAccount, 'lastName', '')}`
    const phone = formatPhoneNumber(get(userAccount, 'phone'))

    const email = get(userProfile, 'displayEmail') ? userProfile.displayEmail : get(auth, 'email')
    return (
      <Grid fluid>
        <div className="profile">
          {
            authorizedUid === uid ? (
              <div style={{ textAlign: 'right', marginRight: 20, marginTop: 10, marginBottom: 10 }}>
                <Link to="/profile/edit">
                  <RaisedButton label="Edit Profile" icon={<ModeEditIcon />} />
                </Link>
              </div>
            ) : null
          }
          <div style={{ display: 'block', margin: 'auto' }}>
            <Row style={{ marginBottom: 10 }}>
              <Col xs={12} sm={12} mdOffset={3} md={5}>
                <Card className="" containerStyle={{ paddingBottom: 0 }}>
                  <Row>
                    <Col xs={12} md={6}>
                      <CardMedia>
                        <img src={profileImageUrl} alt="" />
                      </CardMedia>
                    </Col>
                    <Col xs={12} md={6}>
                      <div>
                        <Row>
                          <Col xs={12}>
                            <CardTitle title={name} titleStyle={{ fontWeight: 500, fontSize: '20px' }} subtitle={headline} />
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12}>
                            { isNaN(numYears) ?
                              null
                              : (
                                <CardText className="crew-text">
                                  {numYears} year(s) in industry
                                </CardText>
                              )
                            }
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12}>
                            { phone ? (
                              <CardText className="crew-text">
                                {phone}
                              </CardText>
                            ) : null
                            }
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12}>
                            <CardText className="crew-text">
                              {email}
                            </CardText>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col xs={12} sm={12} mdOffset={3} md={5}>
                <Card >
                  <Row>
                    <Col xs={12}>
                      <CardTitle title="About Me" titleStyle={{ fontWeight: 500, fontSize: '20px' }} />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      { bio ? (
                        <CardText style={{ lineHeight: '20px', paddingBottom: '40px' }}>
                          {bio}
                        </CardText>
                      ) : (
                        <CardText style={{ paddingBottom: '48px' }}>
                Contact me directly for more information.
                        </CardText>
                      )
                      }
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <CardActions style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {userLinks.map(link => (
                          <RaisedButton style={{ marginBottom: 10 }}primary key={link.title} label={link.title} target="_blank" href={formatLink(link.url)} />
                        ))}
                      </CardActions>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            { video ? (
              <Row style={{ marginBottom: 10 }}>
                <Col xs={12} sm={12} mdOffset={3} md={5}>
                  <Card>
                    <Row>
                      <Col xs={12}>
                        <CardTitle title="Featured Video" titleStyle={{ fontWeight: 500, fontSize: '20px' }} subtitle={video.title} />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <embed width="100%" height="500px" src={linkToEmbed(video.url, videoType)} />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            ) : null }
            <Row style={{ marginBottom: 10 }}>
              <Col xs={12} sm={12} mdOffset={3} md={5}>
                <Card>
                  <Row>
                    <Col xs={12}>
                      <CardTitle title="Credits" titleStyle={{ fontWeight: 500, fontSize: '20px' }} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <div className="roles">
                        {
                          userRoles.map((role) => {
                            const associatedCredits = userCredits.filter(c => c.roleId === role.roleId)

                            associatedCredits.sort((a, b) => {
                              if (a.year < b.year) { return -1 }
                              if (a.year > b.year) { return 1 }
                              return 0
                            })
                            return (
                              <div className="role-column" key={role.roleId}>
                                <Row>
                                  <Col xs={12}>
                                    <div className="rounded-header">
                                      <span>{role.roleName}</span>
                                    </div>
                                    <div className="credits">
                                      { associatedCredits.map(credit => (
                                        <Row>
                                          <Col xs={12}>
                                            <p style={{ textAlign: 'left' }} key={credit.title}>{credit.year}{credit.genre ? ` (${credit.genre})` : ''} : {credit.title}</p>
                                          </Col>
                                        </Row>
                                      )
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            )
                          })
                        }
                      </div>
                    </Col>
                  </Row>
                </Card>

              </Col>
            </Row>
          </div>
        </div>
      </Grid>
    )
  }
}

ViewProfile.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  data: PropTypes.shape({
    roles: PropTypes.object,
    userProfile: PropTypes.object
  }).isRequired
}

ViewProfile.defaultProps = {
}

export default ViewProfile
