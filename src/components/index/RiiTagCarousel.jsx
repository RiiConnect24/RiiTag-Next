import { Carousel } from 'react-bootstrap';
import Link from 'next/link';
import PropTypes from 'prop-types';

function RiiTagCarousel({ randomUsers }) {
  return (
    <Carousel variant="light" fade>
      {randomUsers.map((randomUser) => (
        <Carousel.Item key={randomUser.username}>
          <img
            className="d-block w-75 mx-auto mt-2"
            alt={`RiiTag of ${randomUser.name_on_riitag}`}
            src={`/${randomUser.username}/tag.max.png?${randomUser.updated_at}`}
          />
          <Carousel.Caption className="mb-3 text-light">
            <p className="h4">
              RiiTag of{' '}
              <Link href={`/user/${randomUser.username}`}>
                {randomUser.name_on_riitag}
              </Link>
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

RiiTagCarousel.propTypes = {
  randomUsers: PropTypes.object.isRequired,
};

export default RiiTagCarousel;
