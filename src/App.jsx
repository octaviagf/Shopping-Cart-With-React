import { useEffect, useState } from "react";

export default function App() {
  const [showProducts, setShowProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  function addToCart(product, id) {
    if (id) {
      setSelectedId(id !== selectedId ? id : null);
    } else {
      const isProductInCart = cart.some((item) => item.id === product.id);
      if (!isProductInCart) {
        setCart((prevCart) => [...prevCart, product]);
      } else {
        alert(
          "You already have that product in your shopping cart. Try setting the quantity!"
        );
      }
    }
  }

  function deleteProduct(id) {
    setCart((products) => products.filter((product) => product.id !== id));
  }

  function emptyCart() {
    setCart([]);
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`https://fakestoreapi.com/products`);
      const data = await response.json();
      setShowProducts(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <Products showProducts={showProducts} onAddToCart={addToCart} />
      {cart.length > 0 && (
        <ShoppingCart
          cart={cart}
          onDeleteProduct={deleteProduct}
          onEmptyCart={emptyCart}
        />
      )}
    </div>
  );
}

function Products({ showProducts, onAddToCart }) {
  return (
    <div className="items">
      <ul>
        {showProducts.map((product) => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} className="img" />
            <h2 className="product-name">{product.title}</h2>
            <p className="price">${product.price}</p>
            <button className="btn" onClick={() => onAddToCart(product)}>
              Add to cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShoppingCart({ cart, onDeleteProduct, onEmptyCart }) {
  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {cart.map((product) => (
          <CartItem
            key={product.id}
            product={product}
            onDeleteProduct={onDeleteProduct}
          />
        ))}
      </ul>
      <button onClick={() => onEmptyCart()}>Empty cart</button>
    </div>
  );
}

function CartItem({ product, onDeleteProduct }) {
  const [quantity, setQuantity] = useState(1);

  function buyProduct() {
    alert("Your order has been sent.");
    onDeleteProduct(product.id);
  }

  return (
    <li key={product.id}>
      <img src={product.image} alt={product.title} className="img" />
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <button onClick={() => onDeleteProduct(product.id)}>
        Delete product
      </button>
      <button onClick={() => buyProduct()}>Buy</button>
    </li>
  );
}
