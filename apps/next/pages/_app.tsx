import 'raf/polyfill'
import 'setimmediate'

import { Provider } from 'app/provider'
import Head from 'next/head'
import React from 'react'

import '../global.css'
import { AppProps } from 'next/app'
import { NextPage } from 'next'
import { LayoutDashboard } from '../../../packages/components/layout/LayoutDashboard'

type ExtendedAppProps = AppProps & {
  Component: NextPage & {
    getLayout?: (page: React.ReactElement) => React.ReactNode
  }
}
export default function MyApp({ Component, pageProps }: ExtendedAppProps) {
  const getLayout =
    Component.getLayout ??
    ((page: React.ReactElement) => {
      return <LayoutDashboard>{page}</LayoutDashboard>
    })

  return (
    <>
      <Head>
        <title>Ứng dụng mẫu Solito</title>
        <meta
          name="description"
          content="Expo + Next.js với Solito. Bởi Fernando Rojo."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider>
        <>{getLayout(<Component {...pageProps} />)}</>
      </Provider>
    </>
  )
}
