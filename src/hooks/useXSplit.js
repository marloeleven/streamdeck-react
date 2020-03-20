import { useEffect } from "react";
import connect, { connectionState$ } from "utils/connect/XSplitConnect";

export default setIsConnected => {
  useEffect(() => {
    const subscription = connectionState$.subscribe(state => {
      setIsConnected(state);
    });

    connect();

    return () => subscription.unsubscribe();
  }, [setIsConnected]);
};
