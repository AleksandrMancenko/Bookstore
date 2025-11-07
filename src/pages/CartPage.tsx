import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { cartActions } from "@/features/cart/cart.slice";
import { Button } from "@/components/ui/Button";
import styles from "./CartPage.module.css";

function parsePrice(p: string){
  const n = Number(p.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

export default function CartPage(){
  const dispatch = useDispatch();
  const items = useSelector((s:RootState)=>s.cart.items);
  const total = items.reduce((sum, i)=> sum + parsePrice(i.price) * i.qty, 0);

  if (items.length === 0) return <div>Cart is empty</div>;

  return (
    <div className={styles.root}>
      <ul className={styles.list}>
        {items.map(i=> (
          <li key={i.isbn13} className={styles.item}>
            <img className={styles.img} src={i.image} alt={i.title} />
            <div>
              <div className="title">{i.title}</div>
              <div className="price">{i.price}</div>
            </div>
            <input
              type="number"
              min={1}
              value={i.qty}
              onChange={e=>dispatch(cartActions.setQty({ isbn13: i.isbn13, qty: Number(e.target.value)||1 }))}
            />
            <Button variant="ghost" onClick={()=>dispatch(cartActions.remove({ isbn13: i.isbn13 }))}>Remove</Button>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <div className="total">Total: ${total.toFixed(2)}</div>
        <Button onClick={()=>dispatch(cartActions.clear())}>Clear</Button>
      </div>
    </div>
  );
}

