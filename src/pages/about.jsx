import { Col, Container, Row } from 'react-bootstrap';
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';
import ENV from '@/lib/constants/environmentVariables';
import styles from '@/styles/modules/editor-text.module.scss';
import prisma from '@/lib/db';
import { isBlank } from '@/lib/utils/utils';

export async function getStaticProps() {
  const about = await prisma.sys.findUnique({
    where: {
      key: 'about',
    },
  });

  return {
    props: {
      about: isBlank(about?.value)
        ? '<i>No about text defined...</i>'
        : about.value,
    },
    revalidate: 1,
  };
}

function AboutPage({ about }) {
  return (
    <Container>
      <NextSeo
        title="About RiiTag"
        openGraph={{
          url: `${ENV.BASE_URL}/about`,
        }}
      />

      <Row>
        <Col>
          <h1>About RiiTag</h1>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col
          className={styles.editorText}
          dangerouslySetInnerHTML={{ __html: about }}
        />
      </Row>
    </Container>
  );
}

AboutPage.propTypes = {
  about: PropTypes.string.isRequired,
};

export default AboutPage;
