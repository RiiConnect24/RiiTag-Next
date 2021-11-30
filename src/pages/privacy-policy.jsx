import PropTypes from 'prop-types';
import { Col, Container, Row } from 'react-bootstrap';
import { NextSeo } from 'next-seo';
import prisma from '@/lib/db';
import styles from '@/styles/modules/editor-text.module.scss';
import ENV from '@/lib/constants/environmentVariables';
import { isBlank } from '@/lib/utils/utils';

export async function getStaticProps() {
  const privacyPolicy = await prisma.sys.findUnique({
    where: {
      key: 'privacy-policy',
    },
  });

  return {
    props: {
      privacyPolicy: isBlank(privacyPolicy?.value)
        ? '<i>No Privacy Policy defined...</i>'
        : privacyPolicy.value,
    },
    revalidate: 1,
  };
}

function PrivacyPolicyPage({ privacyPolicy }) {
  return (
    <Container>
      <NextSeo
        title="Privacy Policy"
        openGraph={{
          url: `${ENV.BASE_URL}/privacy-policy`,
        }}
      />
      <Row>
        <Col>
          <h1>Privacy Policy</h1>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col
          className={styles.editorText}
          dangerouslySetInnerHTML={{ __html: privacyPolicy }}
        />
      </Row>
    </Container>
  );
}

PrivacyPolicyPage.propTypes = {
  privacyPolicy: PropTypes.string.isRequired,
};

export default PrivacyPolicyPage;
