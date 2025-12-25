/* @refresh reload */
import { render } from 'solid-js/web'
import { Router } from '@solidjs/router'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18n'

const root = document.getElementById('root')

render(() => (
  <I18nProvider>
    <Router>
      <App />
    </Router>
  </I18nProvider>
), root!)
