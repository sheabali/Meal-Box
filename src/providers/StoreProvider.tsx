import { useRef } from 'react';
import { Provider } from 'react-redux';
import { AppStore, makeStore } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
// import Loading from '@/components/ui/loading';

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  const persistedStore = persistStore(storeRef.current);

  return (
    <Provider store={storeRef.current}>
      {children}
      {/* <PersistGate loading={<Loading />} persistor={persistedStore}>
        {children}
      </PersistGate> */}
    </Provider>
  );
};

export default StoreProvider;
