import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Buffer } from 'buffer'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { RouterProvider } from "react-router-dom";
import './index.css'

import { router } from './router.tsx'
import { config } from './wagmi.ts'

import Header from './components/header.tsx'
import { Toaster } from 'react-hot-toast'
import Moralis from 'moralis'

globalThis.Buffer = Buffer

await Moralis.start({
  apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjE4ZTM4Yzk0LTA1MTYtNDkxNy1hNTkwLTNkNjhhNjgwMzIwMyIsIm9yZ0lkIjoiMzkxNTg2IiwidXNlcklkIjoiNDAyMzY3IiwidHlwZUlkIjoiMWJkZDBlMjctMjJhMS00MWQ5LTljZDAtY2JmZWFiYWU5ZDViIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTUyNDE3MjAsImV4cCI6NDg3MTAwMTcyMH0.YmYfQ4jKh-Ao5UFZYwxVM5A2ECcqc6ECI5jht4_uYyg"
});

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Toaster
          toastOptions={{
            style: {color: "#F6B17A", background: "#2D3250", borderRadius: "16px", border: "1px solid #F6B17A", padding: "4px", fontSize: "16px"},
          }}
          position="top-center"
        />
        <main>
          <RouterProvider router={router}/>
        </main>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
