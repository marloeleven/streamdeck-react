import { useEffect } from 'react';
import { connectionState$ } from 'utils/connect/XSplitConnect';

export default (setIsConnected) => {
  useEffect(() => {
    const subscription = connectionState$.subscribe((state) => {
      setIsConnected(state);
    });

    return () => subscription.unsubscribe();
  }, [setIsConnected]);
};
