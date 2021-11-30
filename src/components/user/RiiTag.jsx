import PropTypes from 'prop-types';

function RiiTag({ username, name, updated_at }) {
  let source = `/${username}/tag.max.png`;

  if (updated_at) {
    source += `?${new Date(updated_at).getTime()}`;
  }

  return (
    <a href={`/${username}/tag.max.png`}>
      <img
        className="img-fluid"
        alt={`RiiTag of ${name}`}
        src={source}
        height={450}
        width={1200}
      />
    </a>
  );
}

RiiTag.propTypes = {
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  updated_at: PropTypes.string,
};

RiiTag.defaultProps = {
  updated_at: null,
};

export default RiiTag;
