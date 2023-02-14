// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from "react";
import QRCode from "qrcode";
import copy from "copy-to-clipboard";
import { NEOPIN_IOS_DOWNLOAD_SVG_URL } from "../assets/download-ios";
import { NEOPIN_AOS_DOWNLOAD_SVG_URL } from "../assets/download-aos";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Notification from "./Notification";

import { WALLETCONNECT_CTA_TEXT_ID } from "../constants";
import { TextMap } from "../types";

async function formatQRCodeImage(data: string) {
  let result = "";
  const dataString = await QRCode.toString(data, { margin: 0, type: "svg" });
  if (typeof dataString === "string") {
    result = dataString.replace("<svg", `<svg class="walletconnect-qrcode__image"`);
  }
  return result;
}

interface QRCodeDisplayProps {
  text: TextMap;
  uri: string;
}

function QRCodeDisplay(props: QRCodeDisplayProps) {
  const [svg, setSvg] = React.useState("");

  React.useEffect(() => {
    (async () => {
      setSvg(await formatQRCodeImage(props.uri));
    })();
  }, []);

  return (
    <div>
      <div className="walletconnect-qrcode__contents">
        <h1 style={{ fontSize: "18px", color: "black", fontWeight: 600 }}>Connect NEOPIN Wallet</h1>
        <p id={WALLETCONNECT_CTA_TEXT_ID} className="walletconnect-qrcode__text">
          {props.text.scan_qrcode_with_wallet}
        </p>
        <div
          dangerouslySetInnerHTML={{ __html: svg }}
          style={{ width: "220px", margin: "0 auto" }}
        ></div>
      </div>
      <hr />
      <div className="walletconnect-modal-downdload">
        <div className="store-title">Download NEOPIN Wallet App</div>
        <div style={{ display: "flex" }} className="store-img">
          <a href="https://play.google.com/store/apps/details?id=com.blockchain.crypto.wallet.neopin">
            <img src={NEOPIN_AOS_DOWNLOAD_SVG_URL} />
          </a>
          <a href="https://apps.apple.com/kr/app/apple-store/id1600381072">
            <img src={NEOPIN_IOS_DOWNLOAD_SVG_URL} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default QRCodeDisplay;
