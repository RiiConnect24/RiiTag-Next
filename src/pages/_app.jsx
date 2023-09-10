import React from 'react'
import '@/styles/globals.scss'
import PropTypes from 'prop-types'
import { SWRConfig } from 'swr'
import { ToastContainer } from 'react-toastify'
import NextNProgress from 'nextjs-progressbar'
import { DefaultSeo } from 'next-seo'
import { SSRProvider } from 'react-bootstrap'
import AppNavbar from '@/components/shared/AppNavbar'
import AppFooter from '@/components/shared/AppFooter'
import ENV from '@/lib/constants/environmentVariables'

function App ({ Component, pageProps }) {
  return (
    <SSRProvider>
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then((response) => response.json())
        }}
      >
        <NextNProgress />
        <AppNavbar />
        <DefaultSeo
          title={undefined}
          titleTemplate='Linktag | %s'
          defaultTitle='LinkTag'
          description='LinkTag is the new generation of gamer tags for Wii.'
          additionalLinkTags={[
            {
              rel: 'apple-touch-icon',
              href: `${ENV.BASE_URL}/img/apple-touch-icon.png`
            },
            {
              rel: 'icon',
              type: 'image/png',
              sizes: '32x32',
              href: `${ENV.BASE_URL}/img/favicon-32x32.png`
            },
            {
              rel: 'icon',
              type: 'image/png',
              sizes: '16x16',
              href: `${ENV.BASE_URL}/img/favicon-16x16.png`
            },
            {
              rel: 'manifest',
              href: `${ENV.BASE_URL}/img/manifest.json`
            },
            {
              rel: 'mask-icon',
              href: `${ENV.BASE_URL}/img/safari-pinned-tag.svg`,
              color: '#5bbad5'
            }
          ]}
          themeColor='#2cb6ea'
          openGraph={{
            type: 'website',
            locale: 'en',
            url: ENV.BASE_URL,
            site_name: 'LinkTag',
            images: [
              {
                url: `${ENV.BASE_URL}/img/linktag_back.png`,
                width: 1920,
                height: 1080,
                alt: 'linktag',
                type: 'image/png'
              }
            ]
          }}
        />
        <Component {...pageProps} />
        <ToastContainer
          position='bottom-center'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme='colored'
        />
        <AppFooter />
      </SWRConfig>
    </SSRProvider>
  )
}

App.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  pageProps: PropTypes.object.isRequired
}

export default App
