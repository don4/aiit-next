import NavBar from "../Navigation/NavBar";
import styles from "../../styles/Header.module.css"

const Header = ({ props }) => {
    return ( <><div className={styles.Container}>
        <div className="logo">

        </div>
        <div className="NavContainer">
            <NavBar {...props}/>   
        </div>
        </div></> );
}
 
export default Header;