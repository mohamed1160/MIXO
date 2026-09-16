import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router'
import '../src/styles/globals.css'

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}
