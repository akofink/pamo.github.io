import React from 'react'
import { link } from 'gatsby-helpers'
import Helmet from 'react-helmet'
import moment from 'moment'
import ReadNext from '../components/ReadNext'
import { rhythm } from 'utils/typography'
import { config } from 'config'
import { prune } from 'underscore.string'
import SocialNetworks from '../components/SocialNetworks'
import ProfileImage from '../components/ProfileImage'

import '../css/zenburn.css'

class MarkdownWrapper extends React.Component {
  render() {
    const { route } = this.props
    const post = route.page.data

    const shortDescription = prune(post.body.replace(/<[^>]*>/g, ''), 100).trim()
    const imageMatchPattern = /<img.+src=[\'"]([^\'"]+)[\'"].*>/i
    const hasImage = (post.body).match(imageMatchPattern)
    let firstImagePath
    const pageUrl = config.blogUrl.slice(0, config.blogUrl.length-1) + link(post.path)

    if (hasImage) firstImagePath = pageUrl + hasImage[1]

    return (
        <div className="markdown">
          <Helmet
            meta={[
              { property: 'og:url', content: pageUrl },
              { name: 'description', content: shortDescription },
              { name: 'twitter:title', content: post.title },
              { name: 'twitter:description', content: shortDescription },
              { name: 'og:description', content: shortDescription },
              { property: 'og:title', content: post.title },
              { property: 'og:image', content: firstImagePath },
              { name: 'twitter:image', content: firstImagePath },
            ]}
            title={ post.title }
          />
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.body }}/>
          <em
            style={{
              display: 'block',
              marginBottom: rhythm(2),
            }}
          >
            Posted {moment(post.date).format('MMMM D, YYYY')}
          </em>
          <hr
            style={{
              marginBottom: rhythm(2),
            }}
          />
          <ReadNext post={post} pages={route.pages} />
          <p>
            <ProfileImage src="/pam-small.jpg" />
            When not crafting an artisinal vimrc, <strong>{config.authorName}</strong> can be found drinking coffee, riding a bike,
            climbing fake rocks, lifting heavy things, and, in general, wandering around San Francisco.</p>
          You can follow her on <SocialNetworks />
        </div>
    )
  }
}

MarkdownWrapper.propTypes = {
  route: React.PropTypes.object,
}

export default MarkdownWrapper
