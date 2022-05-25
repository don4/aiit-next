import Layout from '../components/Layout/Layout';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Header/>
      <Component {...pageProps} />
      <Footer/>
    </Layout>
  )
}

export default MyApp
