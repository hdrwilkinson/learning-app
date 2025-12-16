import type { AppProps } from "next/app";
import "../src/styles/globals.css";
import "../styles/nextra.css";

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
