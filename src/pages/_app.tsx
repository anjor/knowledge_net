import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { WalletProvider } from '../contexts/WalletContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </WalletProvider>
  )
}