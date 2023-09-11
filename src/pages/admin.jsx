import { Col, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { NextSeo } from 'next-seo';
import { withSession } from '@/lib/iron-session';
import prisma from '@/lib/db';
import GeneralAdministrationCard from '@/components/admin/GeneralAdministrationCard';
import PrivacyPolicyCard from '@/components/admin/PrivacyPolicyCard';
import TermsOfServiceCard from '@/components/admin/TermsOfServiceCard';
import ENV from '@/lib/constants/environmentVariables';
import AboutCard from '@/components/admin/AboutCard';

export const getServerSideProps = withSession(async ({ req }) => {
  const username = req.session?.username;

  if (!username) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    select: {
      role: true,
    },
  });

  if (user.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const data = await prisma.sys.findMany({
    select: {
      key: true,
      value: true,
    },
  });

  const systemInfo = {
    about: data.find((x) => x.key === 'about')?.value || '',
    privacyPolicy: data.find((x) => x.key === 'privacy-policy')?.value || '',
    tos: data.find((x) => x.key === 'tos')?.value || '',
  };

  return { props: { systemInfo } };
});

function AdminPage({ systemInfo }) {
  return (
    <Container>
      <NextSeo
        title="Admin"
        openGraph={{
          url: `${ENV.BASE_URL}/admin`,
        }}
      />
      <Row>
        <Col>
          <GeneralAdministrationCard />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <PrivacyPolicyCard privacyPolicy={systemInfo.privacyPolicy} />
        </Col>
        <Col lg={6}>
          <TermsOfServiceCard tos={systemInfo.tos} />
        </Col>
      </Row>
      <Row>
        <Col>
          <AboutCard about={systemInfo.about} />
        </Col>
      </Row>
    </Container>
  );
}

AdminPage.propTypes = {
  systemInfo: PropTypes.object.isRequired,
};

export default AdminPage;
