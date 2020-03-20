import { useEffect } from "react";
import connect, { xsplitConnect$ } from "utils/connect/XSplitConnect";

export default ({ isConnected, setIsConnected }) => {
  useEffect(() => {
    xsplitConnect$.subscribe(state => {
      console.warn("state", state);
      setIsConnected(state);
    });

    return () => xsplitConnect$.unsubscribe();
  }, [setIsConnected]);

  useEffect(() => {
    if (!isConnected) {
      console.warn("trigger connect");
      connect();
    }
  }, [isConnected]);
};
