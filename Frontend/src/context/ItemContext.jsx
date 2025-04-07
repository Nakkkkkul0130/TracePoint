import React, { createContext, useContext, useState } from "react";

const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [foundItems, setFoundItems] = useState([]);

  const addItem = (item) => {
    setFoundItems((prev) => [...prev, item]);
  };

  return (
    <ItemContext.Provider value={{ foundItems, addItem }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItemContext = () => useContext(ItemContext);
