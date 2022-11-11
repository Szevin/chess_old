import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'

import Router from './Router'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'light')
}

if (!localStorage.getItem('language')) {
  localStorage.setItem('language', 'en')
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
)

serviceWorkerRegistration.register()
