import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {getAppConfig} from "../config/config";

export default function App({Component, pageProps}: AppProps) {
    const appConfig = getAppConfig();
    console.log(appConfig, appConfig);
    return (
        <>
            {/* eslint-disable-next-line */}
            <script src="/__ENV.js" />
            <Component {...pageProps} />
        </>
    );
}