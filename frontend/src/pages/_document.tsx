import { Html, Head, Main, NextScript } from 'next/document';

// Minimal custom Document to satisfy Next.js when mixing App Router and Pages internals
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
