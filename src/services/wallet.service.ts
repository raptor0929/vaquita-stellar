import {
  AlbedoModule,
  FREIGHTER_ID,
  FreighterModule,
  ISupportedWallet,
  StellarWalletsKit,
  WalletNetwork,
  xBullModule,
} from "@creit.tech/stellar-wallets-kit";
import { stellarService, StellarService } from "./stellar.service";

class WalletService {
  private readonly kit: StellarWalletsKit;

  constructor(private readonly stellarService: StellarService) {
    this.kit = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: [new xBullModule(), new FreighterModule(), new AlbedoModule()],
    });
  }

  async connect(): Promise<string> {
    return new Promise(async (resolve) => {
      await this.kit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          this.kit.setWallet(option.id);
          const { address } = await this.kit.getAddress();

          resolve(address);
        },
      });
    });
  }

  async disconnect(): Promise<void> {
    await this.kit.disconnect();
  }

  async signTransaction(xdr: string): Promise<{
    signedTxXdr: string;
    signedAddress?: string;
  }> {
    const environment = this.stellarService.environment();
    return await this.kit.signTransaction(xdr, {
      networkPassphrase: environment.networkPassphrase,
    });
  }
}

export const walletService = new WalletService(stellarService);
