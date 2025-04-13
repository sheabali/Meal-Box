import { AppStore, makeStore } from '@/redux/store';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  const persistedStore = persistStore(storeRef.current);

  return (
    <Provider store={storeRef.current}>
      {children}
      {/* <PersistGate loading={null} persistor={persistedStore}>
      {children}
    </PersistGate> */}
      {/* Uncomment the above line to use PersistGate for loading state */}
    </Provider>
  );
};

export default StoreProvider;
