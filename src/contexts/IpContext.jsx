import { createContext, useState, useContext } from 'react';

const IpContext = createContext();

export const IpProvider = ({ children }) => {
  const [ip, setIp] = useState('');

  return (
    <IpContext.Provider value={{ ip, setIp }}>
      {children}
    </IpContext.Provider>
  );
};

export const useIp = () => {
  const context = useContext(IpContext);
  if (!context) {
    throw new Error('useIp must be used within an IpProvider');
  }
  return context;
};