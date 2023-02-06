import Connector from "nptconnect-core";
import { IWalletConnectOptions, IPushServerOptions } from "nptconnect-types";
import * as cryptoLib from "@walletconnect/iso-crypto";

class NeopinConnect extends Connector {
  constructor(connectorOpts: IWalletConnectOptions, pushServerOpts?: IPushServerOptions) {
    super({
      cryptoLib,
      connectorOpts,
      pushServerOpts,
    });
  }
}

export default NeopinConnect;
