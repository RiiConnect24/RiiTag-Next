import PropTypes from 'prop-types';

function RiiTag({ username, name }) {
  return (
    <a href={`/${username}/tag.max.png`}>
      <img
        className="img-fluid"
        alt={`RiiTag of ${name}`}
        src={`/${username}/tag.max.png`}
        height={450}
        width={1200}
      />
    </a>
  );
}

RiiTag.propTypes = {
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default RiiTag;
