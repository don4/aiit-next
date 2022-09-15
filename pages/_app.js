import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout/Layout';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
    <Layout>
      <Header/>
      <Component {...pageProps} />
      <Footer/>
    </Layout>
    </SessionProvider>
  )
}

export default MyApp
