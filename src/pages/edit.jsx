import React from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import { NextSeo } from 'next-seo'
import { withSession } from '@/lib/iron-session'
import prisma from '@/lib/db'
import { isValidCoverRegion } from '@/lib/constants/forms/coverRegions'
import { isValidCoverType } from '@/lib/constants/forms/coverTypes'
import { isValidOverlay } from '@/lib/constants/forms/overlays'
import { isValidFlag } from '@/lib/constants/forms/flags'
import { isValidCoin } from '@/lib/constants/forms/coins'
import { isValidFont } from '@/lib/constants/forms/fonts'
import { BACKGROUNDS } from '@/lib/constants/forms/backgrounds'
import GeneralCard from '@/components/edit/GeneralCard'
import FontCard from '@/components/edit/FontCard'
import ImagesCard from '@/components/edit/ImagesCard'
import ENV from '@/lib/constants/environmentVariables'
import LanguageContext from '@/components/shared/LanguageContext'
import AppNavbar from '@/components/shared/AppNavbar'

export const getServerSideProps = withSession(async ({ req }) => {
  // get the current user session
  const sessionAccount = req.session?.username

  const session = sessionAccount != null
    ? await prisma.user.findUnique({
      where: {
        username: sessionAccount
      },
      select: {
        language: true,
        display_name: true,
        cover_region: true,
        cover_type: true,
        comment: true,
        overlay: true,
        background: true,
        flag: true,
        coin: true,
        font: true,
        show_avatar: true,
        show_mii: true
      }
    })
    : null

  if (!sessionAccount) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return { props: { tagInfo: session, language: session?.language || 'en' } }
})

function EditPage ({ tagInfo, language }) {
  tagInfo.show_avatar = Boolean(tagInfo.show_avatar)
  tagInfo.show_mii = Boolean(tagInfo.show_mii)

  return (
    <LanguageContext.Helper.Provider value={language}>
      <AppNavbar />
      <Formik
        initialValues={{
          nameOnRiiTag: tagInfo.display_name,
          comment: tagInfo.comment === null ? '' : tagInfo.comment,
          coverRegion: tagInfo.cover_region,
          coverType: tagInfo.cover_type,
          showAvatar: tagInfo.show_avatar,
          showMii: tagInfo.show_mii,
          overlay: tagInfo.overlay,
          background: tagInfo.background,
          flag: tagInfo.flag,
          coin: tagInfo.coin,
          font: tagInfo.font
        }}
        validate={(values) => {
          const errors = {}

          if (!values.nameOnRiiTag) {
            errors.nameOnRiiTag = 'Required'
          } else if (values.nameOnRiiTag.length > 20) {
            errors.nameOnRiiTag = 'Name must be < 20 characters.'
          }

          if (values.comment && values.comment.length > 50) {
            errors.comment = 'Comment must be < 50 characters.'
          }

          if (!values.coverRegion) {
            errors.coverRegion = 'Required'
          } else if (isValidCoverRegion(values.coverRegion) === false) {
            errors.coverRegion = 'Invalid Cover Region'
          }

          if (!values.coverType) {
            errors.coverType = 'Required'
          } else if (isValidCoverType(values.coverType) === false) {
            errors.coverType = 'Invalid Cover Type'
          }

          if (!values.overlay) {
            errors.overlay = 'Required'
          } else if (isValidOverlay(values.overlay) === false) {
            errors.overlay = 'Invalid Overlay'
          }

          if (!values.background) {
            errors.background = 'Required'
          } else if (BACKGROUNDS.includes(values.background) === false) {
            errors.background = 'Invalid Background'
          }

          if (!values.flag) {
            errors.flag = 'Required'
          } else if (isValidFlag(values.flag) === false) {
            errors.flag = 'Invalid Flag'
          }

          if (!values.coin) {
            errors.coin = 'Required'
          } else if (isValidCoin(values.coin) === false) {
            errors.coin = 'Invalid Coin'
          }

          if (!values.font) {
            errors.font = 'Required'
          } else if (isValidFont(values.font) === false) {
            errors.font = 'Invalid Font'
          }

          return errors
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await toast.promise(
            fetch('/api/account/tag', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(values)
            }),
            {
              pending: 'Updating & regenerating your tag...',
              success: {
                render ({ data, toastProps }) {
                  if (data.status !== 200) {
                    toastProps.type = 'error'
                    return 'An error occured, please try again later'
                  }
                  return 'Saved!'
                }
              },
              error: 'An error occured, please try again later.'
            }
          )

          setSubmitting(false)
        }}
      >
        {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Container>
              <NextSeo
                title='Edit LinkTag'
                openGraph={{
                  url: `${ENV.BASE_URL}/edit`
                }}
              />
              <Button
                className='rounded-circle shadow position-fixed'
                disabled={isSubmitting}
                type='submit'
                variant='success'
                style={{
                  bottom: '7%',
                  right: '5%',
                  width: 70,
                  height: 70,
                  fontSize: '2rem',
                  zIndex: 99
                }}
              >
                <FontAwesomeIcon icon={faSave} />
              </Button>
              <Row>
                <Col lg={6}>
                  <GeneralCard
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                  />

                  <FontCard values={values} errors={errors} />
                </Col>

                <Col lg={6}>
                  <ImagesCard
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                  />
                </Col>
              </Row>
            </Container>
          </Form>
        )}
      </Formik>
    </LanguageContext.Helper.Provider>
  )
}

EditPage.propTypes = {
  tagInfo: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired
}

export default EditPage
