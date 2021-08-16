import * as React from 'react';

import { Size } from '../scale';

export interface IDocumentContext {
  numPages: number;
  pageSize: Size; // Scaled at 100%, might want a better name
  setNumPages: (numPages: number) => void;
  setPageSize: (pageSize: Size) => void;
}

export const DocumentContext = React.createContext<IDocumentContext>({
  numPages: 0,
  pageSize: { height: 0, width: 0 },
  // TODO: #28926 Log this with an error util instead of returning value
  setNumPages: numPages => {
    return numPages;
  },
  setPageSize: pageSize => {
    return pageSize;
  },
});
