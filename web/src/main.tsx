import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { wagmiConfig } from './contracts/config'
import { store } from './store'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 1000 * 60 * 5 },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
            <Toaster position="top-right" toastOptions={{
              style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                background: '#FFFFFF',
                color: '#1E1C12',
                border: '1px solid #FAF3E2',
                boxShadow: '0 24px 48px rgba(27,67,50,0.08)',
              },
            }} />
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
