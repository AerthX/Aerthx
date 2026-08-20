import React from 'react';
import {RouterProvider} from 'react-router-dom';
import router from './routes/AppRoutes';
import { Provider } from 'react-redux';
import { store } from '../src/shared-redux/src/store';
import AppWrapper from "../src/shared-redux/src/components/AppWrapper";
import "./index.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
     <Provider store={store}>
          <AppWrapper>
     <RouterProvider router={router} />
              <ToastContainer position="bottom-right" autoClose={3000} />
     </AppWrapper>
    </Provider>
  )
}

export default App