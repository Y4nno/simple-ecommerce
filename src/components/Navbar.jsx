import {Link} from 'react-router-dom'

function Navbar(){
   return(
    <nav>
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/checkout">Checkout</Link>
        <Link to="/products">Products</Link>
    </nav>
   )
}

export default Navbar