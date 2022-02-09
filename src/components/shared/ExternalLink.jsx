import PropTypes from 'prop-types';

export default function ExternalLink({ link, children }) {
    return (
      <a href={link} target="_blank" rel="external noopener noreferrer">
        {children}
      </a>
    );
}

ExternalLink.propTypes = {
  link: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};