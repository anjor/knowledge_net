import React from 'react';
import Head from 'next/head';
import { MarketplaceHome } from '../components/MarketplaceHome';

export default function Home() {
  return (
    <>
      <Head>
        <title>KnowledgeNet - Decentralized AI Knowledge Marketplace</title>
        <meta name="description" content="Access verified scientific data for AI models through our decentralized marketplace powered by Filecoin and IPFS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MarketplaceHome />
    </>
  );
}