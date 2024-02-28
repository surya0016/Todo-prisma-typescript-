import React, { useContext ,useState, createContext } from 'react'

interface ContextData {
  value: number;
  updateValue: (newValue:number)=>void;
}

export const Context = createContext<ContextData | undefined>(undefined);

export const useMyContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};

export const ContextProvider: React.FC = (props:any) => {
  const [value, setValue] = useState<number>(1);

  const updateValue = (newValue: number) => {
    setValue(newValue);
  };

  return (
    <Context.Provider value={{ value, updateValue }}>
      {props.children}
    </Context.Provider>
  );
};
