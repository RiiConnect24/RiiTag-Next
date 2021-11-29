import { Col, Container, Row } from 'react-bootstrap';
import safeJsonStringify from 'safe-json-stringify';
import PropTypes from 'prop-types';
import { NextSeo } from 'next-seo';
import { withSession } from '@/lib/iron-session';
import prisma from '@/lib/db';
import RiiTag from '@/components/user/RiiTag';
import UserInformationCard from '@/components/user/UserInformationCard';
import ShowYourTagCard from '@/components/user/ShowYourTagCard';
import ENV from '@/lib/constants/environmentVariables';

export const getServerSideProps = withSession(async ({ req, query }) => {
  const { username } = query;
  const loggedInUser = req.session?.username;

  const user = await prisma.user.findUnique({
    where: {
      username: username.toString(),
    },
    select: {
      username: true,
      image: true,
      name_on_riitag: true,
      created_at: true,
      overlay: true,
      background: true,
      coin: true,
      flag: true,
      font: true,
      cover_region: true,
      cover_type: true,
    },
  });

  if (!user) {
    return { notFound: true };
  }

  return {
    props: {
      user: JSON.parse(safeJsonStringify(user)),
      isLoggedIn: user.username === loggedInUser,
    },
  };
});

function ProfilePage({ user, isLoggedIn }) {
  return (
    <Container>
      <NextSeo
        title={user.name_on_riitag}
        description={`See what ${user.name_on_riitag} has played`}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: `${ENV.BASE_URL}/logo.png`,
          },
        ]}
        openGraph={{
          images: [
            {
              url: `${ENV.BASE_URL}/${user.username}/tag.max.png`,
              width: 1200,
              height: 450,
              alt: `RiiTag of ${user.name_on_riitag}`,
              type: 'image/png',
            },
          ],
          profile: {
            username: user.name_on_riitag,
          },
        }}
      />
      <Row>
        <Col lg={7}>
          <div className="mb-3">
            <RiiTag username={user.username} name={user.name_on_riitag} />
          </div>

          {isLoggedIn && <ShowYourTagCard username={user.username} />}
        </Col>

        <Col lg={5}>
          <UserInformationCard user={user} isLoggedIn={isLoggedIn} />
        </Col>
      </Row>
    </Container>
  );
}

ProfilePage.propTypes = {
  user: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default ProfilePage;
