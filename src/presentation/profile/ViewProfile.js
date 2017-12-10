import React from 'react'
import QueryString from 'query-string'
import { Card, CardMedia, CardText, CardTitle, CardActions } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import WebsiteIcon from 'material-ui/svg-icons/hardware/laptop-mac'
import { get } from 'lodash'
import PropTypes from 'prop-types'
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
      case 'youtube':
        const youtubeRegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
        const youtubeMatch = link.match(youtubeRegExp)
        const youtubeVideoID = youtubeMatch[7]

        return `https://www.youtube.com/embed/${youtubeVideoID}`

      case 'vimeo':
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
    const { data, location } = this.props

    // gets uid of current public profile from URL
    const parsed = QueryString.parse(location.search)
    const uid = parsed.query

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
    const youtubeVideo = get(userProfile, 'youtubeVideo', '')
    const vimeoVideo = get(userProfile, 'vimeoVideo', '')

    const profileImageUrl = get(userAccount, 'photoURL', defaultImage)
    const name = `${get(userAccount, 'firstName', '')} ${get(userAccount, 'lastName', '')}`
    const phone = formatPhoneNumber(get(userAccount, 'phone'))

    let email = get(userAccount, 'email')
    const displayEmail = get(userProfile, 'displayEmail')
    if(displayEmail) email = displayEmail 

    return (
      <div className="profile">
        <div style={{ display: 'block', margin: 'auto' }}>
          <Card className="profile-card top-card" containerStyle={{ width: '50%', paddingBottom: 0, display: 'flex', flexDirection: 'row' }}>
            <CardMedia className="crew-image">
              <img src={profileImageUrl} alt="" style={{ width: 250, height: 250, objectFit: 'cover', borderBottomLeftRadius: 2, borderTopLeftRadius: 2 }} />
            </CardMedia>
            <div>
              <CardTitle title={name} titleStyle={{ fontWeight: 500, fontSize: '20px' }} subtitle={headline} subtitleStyle={{ minWidth: '250%', fontStyle: 'italic' }} />
              { isNaN(numYears) ?
                null
                : (
                  <CardText className="crew-text">
                    {numYears} years in industry
                  </CardText>
                )
              }
              { phone ? (
                <CardText className="crew-text">
                  {phone}
                </CardText>
              ) : null
              }
              <CardText className="crew-text">
                {email}
              </CardText>
            </div>
          </Card>

          { bio || userLinks.length !== 0 ? (
            <Card className="profile-card small-card">
              <CardTitle title="About Me" titleStyle={{ fontWeight: 500, fontSize: '20px' }} />
              <CardText style={{lineHeight: '20px'}}>
                {bio}
              </CardText>
              <CardActions>
                {userLinks.map(link => (
                  <RaisedButton primary label={link.title} target="_blank" href={link.url} icon={<WebsiteIcon />} />
                ))}
              </CardActions>
            </Card>
          ) : null
          }

          { youtubeVideo ? (
            <Card className="profile-card big-card">
              <CardTitle title="Featured Video" titleStyle={{ fontWeight: 500, fontSize: '20px' }} subtitle={youtubeVideo[0].title} />
              <embed width="100%" height="500px" src={linkToEmbed(youtubeVideo[0].url, 'youtube')} />
            </Card>
          ) : null}

          { vimeoVideo ? (
            <Card className="profile-card big-card">
              <CardTitle title="Featured Video" titleStyle={{ fontWeight: 500, fontSize: '20px' }} subtitle={vimeoVideo[0].title} />
              <embed width="100%" height="500px" src={linkToEmbed(vimeoVideo[0].url, 'vimeo')} />
            </Card>
          ) : null}

          <Card className="profile-card big-card">
            <CardTitle title="Credits" titleStyle={{ fontWeight: 500, fontSize: '20px' }} />
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
                      <div className="rounded-header"><span>{role.roleName}</span></div>
                      <div className="credits">
                        { associatedCredits.map(credit => (
                          <p style={{ textAlign: 'left' }} key={credit.title}>{credit.year}{credit.genre ? ` (${credit.genre})` : ''} : {credit.title}</p>
                        )
                        )}
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </Card>
        </div>
      </div>
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
