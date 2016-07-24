import React from 'react';
import { prefixLink } from 'gatsby-helpers';

const ProfileImage = (props) => {
  const { src, style } = props;
  let mergedStyles = Object.assign({
    border: '.25em solid',
    borderColor: '#01A1DD',
    borderRadius: '50%',
    maxWidth: '80px',
    maxHeight: '80px',
  }, style);
  return (
      <img src={ prefixLink(src) }
        alt="photo of pam" style = { mergedStyles }
      />);
};

ProfileImage.propTypes = {
  src: React.PropTypes.string.isRequired,
  style: React.PropTypes.object,
};

export default ProfileImage;
