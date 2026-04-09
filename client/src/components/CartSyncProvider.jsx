import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSyncCartMutation } from '../redux/slices/cartSyncApiSlice';

const CartSyncProvider = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [syncCart] = useSyncCartMutation();
  const debounceRef = useRef(null);

  useEffect(() => {
    // Only sync for logged-in users
    if (!userInfo) return;

    // Debounce: wait 5 seconds after last cart change before syncing
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      syncCart({ cartItems }).catch(() => {});
    }, 5000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [cartItems, userInfo, syncCart]);

  return null; // Invisible component
};

export default CartSyncProvider;
