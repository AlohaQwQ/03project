import { createContext, useContext } from 'react';
import React from 'react';
const DEFAULT_CONTEXT = {
  metaplex: null,
};

export const MetaplexContext = createContext(DEFAULT_CONTEXT);

export function useMetaplex() {
  return useContext(MetaplexContext);
}

const useMetaplexX = () => {

}
export default useMetaplexX;
