import React from 'react'
import { get } from 'lodash'
import { Card, CardMedia, CardText, CardTitle, CardActions } from 'material-ui/Card'
import { Link } from 'react-router-dom'
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit'
import './VendorProfile.css'
import formatLink from '../../util/formatLink'
import RaisedButton from 'material-ui/RaisedButton'

const defaultImage = 'https://images.vexels.com/media/users/3/144866/isolated/preview/927c4907bbd0598c70fb79de7af6a35c-business-building-silhouette-by-vexels.png'

function formatPhoneNumber(s) {
  const s2 = (`${s}`).replace(/\D/g, '')
  const m = s2.match(/^(\d{3})(\d{3})(\d{4})$/)
  return (!m) ? null : `(${m[1]}) ${m[2]}-${m[3]}`
}

function formatCityStateZip(city, state, zip) {
  const cityWithComma = city ? `${city}, ` : null
  return (city || state || zip) ? `${cityWithComma} ${state} ${zip}` : null
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

const VendorProfilePage = (props) => {
  const uid = get(props, 'auth.uid', '')
  const vendorId = get(props, 'match.params.vendorId', '')
  const vendorProfile = get(props, `data.vendorProfiles.${vendorId}`)
  const vendorCreator = get(vendorProfile, 'creator', '')
  const vendorPhone = formatPhoneNumber(get(vendorProfile, 'phone', ''))
  const vendorName = get(vendorProfile, 'name', '')
  const profileImageUrl = get(vendorProfile, 'profileImage', defaultImage)
  const vendorEmail = get(vendorProfile, 'email', '')
  const vendorBio = get(vendorProfile, 'aboutUs', '')
  const vendorLinks = get(vendorProfile, 'links', [])

  const video = get(vendorProfile, 'video', '')[0]
  let videoType = 0
  if (video) videoType = video.url.indexOf('youtube') > -1 ? 1 : 2 // 1 for Youtube, 2 for Vimeo

  const vendorAddressLine1 = get(vendorProfile, 'addressLine1', '')
  const vendorAddressLine2 = get(vendorProfile, 'addressLine2', '')
  const vendorCity = get(vendorProfile, 'city', '')
  const vendorState = get(vendorProfile, 'state', '')
  const vendorZip = get(vendorProfile, 'zip', '')
  const vendorCityStateZip = formatCityStateZip(vendorCity, vendorState, vendorZip)

  const primaryContactPhone = formatPhoneNumber(get(vendorProfile, 'primaryContactPhone', ''))
  const primaryContactName = get(vendorProfile, 'primaryContactName', '')
  const primaryContactEmail = get(vendorProfile, 'primaryContactEmail', '')
  const primaryContactAboutUs = get(vendorProfile, 'primaryContactAboutUs', '')
  const primaryContactAddressLine1 = get(vendorProfile, 'primaryContactAddressLine1', '')
  const primaryContactAddressLine2 = get(vendorProfile, 'primaryContactAddressLine2', '')
  const primaryContactCity = get(vendorProfile, 'primaryContactCity', '')
  const primaryContactState = get(vendorProfile, 'primaryContactState', '')
  const primaryContactZip = get(vendorProfile, 'primaryContactZip', '')
  const primaryContactCityStateZip = formatCityStateZip(primaryContactCity, primaryContactState, primaryContactZip)

  if (vendorProfile) {
    return (
      <div>
        {
          vendorCreator === uid ? (
            <div style={{ textAlign: 'right', marginRight: 20, marginTop: 10, marginBottom: 10 }}>
              <Link to={`/vendor/${vendorId}/edit`}>
                <RaisedButton label="Edit Vendor" icon={<ModeEditIcon />} />
              </Link>
            </div>
          ) : null
        }
        <Card className="profile-card vendor-profile" containerStyle={{ paddingBottom: 0, display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
          <CardMedia className="crew-image-container">
            <img src={profileImageUrl} className="crew-image" alt="" />
          </CardMedia>
          <div style={{ minWidth: '200px', width: '100%' }}>
            <CardTitle title={vendorName} titleStyle={{ fontWeight: 500, fontSize: '20px' }} />
            { vendorAddressLine1 ? (
              <CardText className="vendor-text" style={{ paddingBottom: '4px', paddingTop: '0px', width: '100%' }}>
                {vendorAddressLine1}
              </CardText>
            ) : null
            }
            { vendorAddressLine2 ? (
              <CardText className="vendor-text" style={{ paddingBottom: '4px', paddingTop: '4px', width: '100%' }}>
                {vendorAddressLine2}
              </CardText>
            ) : null
            }
            { vendorCityStateZip ? (
              <CardText className="vendor-text" style={{ paddingBottom: '8px', paddingTop: '4px', width: '100%' }}>
                {vendorCityStateZip}
              </CardText>
            ) : null
            }
            { vendorPhone ? (
              <CardText className="vendor-text" style={{ paddingBottom: '8px', paddingTop: '8px', width: '100%' }}>
                {vendorPhone}
              </CardText>
            ) : null
            }
            { vendorEmail ? (
              <CardText className="vendor-text" style={{ paddingBottom: '8px', paddingTop: '8px', width: '100%' }}>
                {vendorEmail}
              </CardText>
            ) : null
            }
          </div>
        </Card>

        <Card className="profile-card vendor-primaryContact" containerStyle={{ paddingBottom: 0, display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
          <div style={{ width: '35%' }}>
            { primaryContactName ? (
              <CardText className="vendor-text" style={{ paddingBottom: '8px', paddingTop: '16px' }}>
                {primaryContactName}
              </CardText>
            ) : null
            }
            { primaryContactAddressLine1 ? (
              <CardText className="vendor-text" style={{ paddingBottom: '4px', paddingTop: '8px', width: '100%' }}>
                {primaryContactAddressLine1}
              </CardText>
            ) : null
            }
            { primaryContactAddressLine2 ? (
              <CardText className="vendor-text" style={{ paddingBottom: '4px', paddingTop: '4px', width: '100%' }}>
                {primaryContactAddressLine2}
              </CardText>
            ) : null
            }
            { primaryContactCityStateZip ? (
              <CardText className="vendor-text" style={{ paddingBottom: '8px', paddingTop: '4px', width: '100%' }}>
                {primaryContactCityStateZip}
              </CardText>
            ) : null
            }
            { primaryContactPhone ? (
              <CardText className="vendor-text" style={{ paddingBottom: '8px', paddingTop: '8px' }}>
                {primaryContactPhone}
              </CardText>
            ) : null
            }
            { primaryContactEmail ? (
              <CardText className="vendor-text" style={{ paddingBottom: '16px', paddingTop: '8px' }}>
                {primaryContactEmail}
              </CardText>
            ) : null
            }
          </div>
          <div style={{ width: '75%' }}>
            { primaryContactAboutUs ? (
              <CardText className="vendor-text" style={{ paddingBottom: '8px', paddingTop: '16px' }}>
                {primaryContactAboutUs}
              </CardText>
            ) : null
            }
          </div>
        </Card>

        <Card className="profile-card vendor-bio" containerStyle={{ width: '95%', paddingBottom: 0, display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
          <div>
            <CardTitle title={'About Us'} titleStyle={{ fontWeight: 500, fontSize: '20px' }} />
            { vendorBio ? (
              <CardText style={{ lineHeight: '20px', paddingBottom: '40px' }}>
                {vendorBio}
              </CardText>
            ) : (
              <CardText style={{ paddingBottom: '48px' }}>
                                Contact us directly for more information.
              </CardText>
            )
            }

            <CardActions>
              {vendorLinks.map(link => (
                <RaisedButton primary key={link.title} label={link.title} target="_blank" href={formatLink(link.url)} />
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

VendorProfilePage.propTypes = {
}

VendorProfilePage.defaultProps = {
}

export default VendorProfilePage
