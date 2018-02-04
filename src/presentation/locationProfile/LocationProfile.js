import React from 'react'
import { get } from 'lodash'
import { Card, CardMedia, CardText, CardTitle, CardActions } from 'material-ui/Card'
import { Link } from 'react-router-dom'
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit'
import './LocationProfile.css'
import RaisedButton from 'material-ui/RaisedButton'

const defaultImage = 'https://images.vexels.com/media/users/3/144866/isolated/preview/927c4907bbd0598c70fb79de7af6a35c-business-building-silhouette-by-vexels.png'

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

const LocationProfilePage = (props) => {
  const uid = get(props, 'auth.uid', '')
  const locationId = get(props, 'match.params.locationId', '')
  const locationProfile = get(props, `data.locationProfiles.${locationId}`)
  const locationCreator = get(locationProfile, 'creator', '')
  const locationPhone = formatPhoneNumber(get(locationProfile, 'phone', ''))
  const locationName = get(locationProfile, 'name', '')
  const profileImageUrl = get(locationProfile, 'profileImage', defaultImage)
  const locationEmail = get(locationProfile, 'email', '')
  const locationBio = get(locationProfile, 'aboutUs', '')
  const locationLinks = get(locationProfile, 'links', [])
  const locationStreet = get(locationProfile, 'addressLine1', '')
  const locationCityState = get(locationProfile, 'addressLine2', '')
  const video = get(locationProfile, 'video', '')[0]
  let videoType = 0
  if (video) videoType = video.url.indexOf('youtube') > -1 ? 1 : 2 // 1 for Youtube, 2 for Vimeo


  if (locationProfile) {
    return (
      <div>
        {
          locationCreator === uid ? (
            <div style={{ textAlign: 'right', marginRight: 20, marginTop: 10 }}>
              <Link to={`/location/${locationId}/edit`}>
                <RaisedButton label="Edit Profile" icon={<ModeEditIcon />} />
              </Link>
            </div>
          ) : null
        }
        <Card className="profile-card location-profile" containerStyle={{ paddingBottom: 0, display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
          <CardMedia className="crew-image">
            <img src={profileImageUrl} alt="" style={{ width: 250, height: 250, objectFit: 'cover', borderBottomLeftRadius: 2, borderTopLeftRadius: 2, minWidth: 250, minHeight: 250 }} />
          </CardMedia>
          <div style={{ minWidth: '200px', width: '100%' }}>
            <CardTitle title={locationName} titleStyle={{ fontWeight: 500, fontSize: '20px' }} />
            { locationStreet ? (
              <CardText className="location-text" style={{ paddingBottom: '8px', paddingTop: '0px', width: '100%' }}>
                {locationStreet}
                <br />
                {locationCityState}
              </CardText>
            ) : null
            }
            { locationPhone ? (
              <CardText className="location-text" style={{ paddingBottom: '8px', paddingTop: '8px', width: '100%' }}>
                {locationPhone}
              </CardText>
            ) : null
            }
            { locationEmail ? (
              <CardText className="location-text" style={{ paddingBottom: '8px', paddingTop: '8px', width: '100%' }}>
                {locationEmail}
              </CardText>
            ) : null
            }
          </div>
        </Card>

        <Card className="profile-card big-card location-bio" containerStyle={{ width: '95%', paddingBottom: 0, display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
          <div>
            <CardTitle title={'About Us'} titleStyle={{ fontWeight: 500, fontSize: '20px' }} />
            { locationBio ? (
              <CardText style={{ lineHeight: '20px', paddingBottom: '40px' }}>
                {locationBio}
              </CardText>
            ) : (
              <CardText style={{ paddingBottom: '48px' }}>
                                Contact us directly for more information.
              </CardText>
            )
            }

            <CardActions>
              {locationLinks.map(link => (
                <RaisedButton primary key={link.title} label={link.title} target="_blank" href={link.url} />
              ))}
            </CardActions>
          </div>
        </Card>

        { video ? (
          <Card className="profile-card big-card">
            <CardTitle title="Featured Video" titleStyle={{ fontWeight: 500, fontSize: '20px' }} subtitle={video.title} />
            <embed width="100%" height="500px" src={linkToEmbed(video.url, videoType)} />
          </Card>
        ) : null }
      </div>

    )
  }
  return null
}

LocationProfilePage.propTypes = {
}

LocationProfilePage.defaultProps = {
}

export default LocationProfilePage
