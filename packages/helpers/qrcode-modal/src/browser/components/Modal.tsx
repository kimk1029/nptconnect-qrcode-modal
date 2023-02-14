import * as React from "react";
import {
  IMobileRegistryEntry,
  IQRCodeModalOptions,
  IAppRegistry,
  IMobileLinkInfo,
} from "nptconnect-types";
import {
  isMobile,
  isAndroid,
  formatIOSMobile,
  saveMobileLinkInfo,
  getMobileLinkRegistry,
  getWalletRegistryUrl,
  formatMobileRegistry,
} from "nptconnect-browser-utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import Header from "./Header";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import LinkDisplay from "./LinkDisplay";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import QRCodeDisplay from "./QRCodeDisplay";

import { WALLETCONNECT_MODAL_ID } from "../constants";
import { TextMap } from "../types";

interface ModalProps {
  text: TextMap;
  uri: string;
  onClose: any;
  qrcodeModalOptions?: IQRCodeModalOptions;
}
export const WHITELIST = {
  neopin: {
    id: "neopin",
    name: "Neopin",
    description: "Neopin",
    homepage: "https://neopin.io/",
    chains: ["eip155:1", "eip155:10", "eip155:137", "eip155:42161"],
    versions: ["1"],
    app_type: "wallet",
    image_id: "neopin-img",
    image_url: {
      sm: "https://neopin.io/assets/img/neopin_appicon.png",
      md: "https://neopin.io/assets/img/neopin_appicon.png",
      lg: "https://neopin.io/assets/img/neopin_appicon.png",
    },
    app: {
      browser: null,
      ios:
        "https://apps.apple.com/kr/app/neopin-%ED%98%84%EB%AA%85%ED%95%9C-%ED%81%AC%EB%A6%BD%ED%86%A0-%EC%9E%90%EC%82%B0-%EA%B4%80%EB%A6%AC/id1600381072",
      android: "https://play.google.com/store/apps/details?id=com.blockchain.crypto.wallet.neopin",
      mac: null,
      windows: null,
      linux: null,
    },
    mobile: {
      native: "neopin:",
      universal: "https://neopin.page.link",
    },
    desktop: {
      native: null,
      universal: null,
    },
    metadata: {
      shortName: "Neopin",
      colors: {
        primary: "#001e59",
        secondary: null,
      },
    },
  },
};

function Modal(props: ModalProps) {
  const android = isAndroid();
  const mobile = isMobile();
  React.useEffect(() => {
    document.addEventListener("click", e => {
      //@ts-ignore
      if (e.target && e.target.id === "walletconnect-qrcode-modal") {
        props.onClose();
      }
    });
  }, []);
  const whitelist = mobile
    ? props.qrcodeModalOptions && props.qrcodeModalOptions.mobileLinks
      ? props.qrcodeModalOptions.mobileLinks
      : undefined
    : props.qrcodeModalOptions && props.qrcodeModalOptions.desktopLinks
    ? props.qrcodeModalOptions.desktopLinks
    : undefined;
  const [loading, setLoading] = React.useState(false);
  const [fetched, setFetched] = React.useState(false);
  const [displayQRCode, setDisplayQRCode] = React.useState(!mobile);
  const displayProps = {
    mobile,
    text: props.text,
    uri: props.uri,
    qrcodeModalOptions: props.qrcodeModalOptions,
  };

  const [singleLinkHref, setSingleLinkHref] = React.useState("");
  const [hasSingleLink, setHasSingleLink] = React.useState(false);
  const [links, setLinks] = React.useState<IMobileRegistryEntry[]>([]);
  const [errorMessage, setErrorMessage] = React.useState("");

  const getLinksIfNeeded = () => {
    if (fetched || loading || (whitelist && !whitelist.length) || links.length > 0) {
      return;
    }

    React.useEffect(() => {
      const initLinks = async () => {
        if (android) return;
        setLoading(true);
        try {
          const url =
            props.qrcodeModalOptions && props.qrcodeModalOptions.registryUrl
              ? props.qrcodeModalOptions.registryUrl
              : getWalletRegistryUrl();
          // const registryResponse = await fetch(url);
          // const registry = (await registryResponse.json()).listings as IAppRegistry;
          const registryResponse = WHITELIST;
          const registry = (registryResponse as unknown) as IAppRegistry;
          const platform = mobile ? "mobile" : "desktop";
          const _links = getMobileLinkRegistry(formatMobileRegistry(registry, platform), whitelist);
          setLoading(false);
          setFetched(true);
          setErrorMessage(!_links.length ? props.text.no_supported_wallets : "");
          setLinks(_links);
          const hasSingleLink = _links.length === 1;
          if (hasSingleLink) {
            setSingleLinkHref(formatIOSMobile(props.uri, _links[0]));
            setDisplayQRCode(true);
          }
          setHasSingleLink(hasSingleLink);
        } catch (e) {
          setLoading(false);
          setFetched(true);
          setErrorMessage(props.text.something_went_wrong);
          console.error(e); // eslint-disable-line no-console
        }
      };
      initLinks();
    });
  };

  getLinksIfNeeded();

  const rightSelected = mobile ? displayQRCode : !displayQRCode;
  return (
    <div id={WALLETCONNECT_MODAL_ID} className="walletconnect-qrcode__base animated fadeIn">
      <div className="walletconnect-modal__base">
        {/* <Header onClose={props.onClose} /> */}
        {hasSingleLink && displayQRCode ? (
          <div className="walletconnect-modal__single_wallet">
            <a
              onClick={() =>
                saveMobileLinkInfo({
                  name: links[0].name,
                  href: singleLinkHref,
                })
              }
              href={singleLinkHref}
              rel="noopener noreferrer decode"
              target="_blank"
            >
              {props.text.connect_with + " " + (hasSingleLink ? links[0].name : "") + " ›"}
            </a>
          </div>
        ) : android || loading || (!loading && links.length) ? (
          <></>
        ) : null}

        <div>
          {displayQRCode || (!android && !loading && !links.length) ? (
            <QRCodeDisplay {...displayProps} />
          ) : (
            <LinkDisplay {...displayProps} links={links} errorMessage={errorMessage} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
