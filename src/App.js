import React, {useEffect} from "react";
import AppRoutes from "./views";
import store from "./config/store";
import {Provider} from "react-redux";
import {initAxios} from "./config/api-config";
import './sass/spacing/spacing-margin.scss'
import './sass/spacing/spacing-padding.scss'
initAxios()


function App() {

  return (
  <Provider store={store}>
     <AppRoutes />
  </Provider>
);
}

export default App;
