import Head from 'next/head'
const Layout = ({ children }) => {
    return ( <>
    <Head>
        <title>All India InfoTech - Innovation in Software</title>
        <meta name="description" content="All India InfoTech - Innovation in Software" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    {children}
    </> );
}
 
export default Layout;