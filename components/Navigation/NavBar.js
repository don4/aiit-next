import Link from 'next/link'
import { useState, useEffect } from 'react';
import styles from '../../styles/Navigation.module.css'
const NavBar = ({ props }) => {
    const [isLoading, setLoading] = useState(true)
    const [navData, setNavData] = useState({})
    useEffect(()=>{
        const fetchNavData = async () =>{
            const response = await fetch('http://localhost:4000/NavData')
            const data = await response.json();
            setLoading(false)
            setNavData(data)
        }
        fetchNavData()
    }, [])
    if(isLoading){
        return(
            <h2>Loading...</h2> // need to update global loading
        )
    }
    return ( <>
    <div className={styles.NavBar}>
<ul>
    {navData.l0Item.map((navItem)=>{
        return(<li key={navItem.id}>
             <Link href={navItem.url}><a>{navItem.title}</a></Link>
        </li>)
    })}
    
</ul>
    </div>
    
    </> );
}
 
export default NavBar;