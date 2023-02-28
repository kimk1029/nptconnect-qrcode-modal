// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from "react";
import QRCode from "qrcode";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          Scan the QR code in your Neopin wallet.
        </p>
        <div
          dangerouslySetInnerHTML={{ __html: svg }}
          style={{ width: "220px", margin: "0 auto" }}
        ></div>
      </div>
    </div>
  );
}

export default QRCodeDisplay;
