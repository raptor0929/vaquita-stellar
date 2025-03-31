import {
  contract,
  Horizon,
  Networks,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

export class StellarService {
  private readonly server: Horizon.Server;
  private readonly serverUrl: string;
  private readonly rpcUrl: string;
  private readonly networkPassphrase: string;
  private readonly contractAddress: string;

  constructor() {
    const serverUrl = "https://horizon-testnet.stellar.org";

    this.server = new Horizon.Server(serverUrl);
    this.serverUrl = serverUrl;
    this.rpcUrl = "https://soroban-testnet.stellar.org";

    this.networkPassphrase = Networks.TESTNET;
    this.contractAddress =
      "CAOYBB6TULYCAFFGAZN7H6PYOS73QL234WL7TC5UKVQ6WJECNOYMBU7E";
  }

  async loadAccount(address: string) {
    return await this.server.loadAccount(address);
  }

  async getTransactions(address: string) {
    return await this.server.transactions().forAccount(address).call();
  }

  async getPayments(address: string) {
    return await this.server.payments().forAccount(address).call();
  }

  async buildClient<T = unknown>(publicKey: string): Promise<T> {
    const client = await contract.Client.from({
      contractId: this.contractAddress,
      rpcUrl: this.rpcUrl,
      networkPassphrase: this.networkPassphrase,
      publicKey,
    });

    return client as T;
  }

  async submitTransaction(xdr: string): Promise<string> {
    try {
      const result = await this.server.submitTransaction(
        TransactionBuilder.fromXDR(xdr, this.networkPassphrase)
      );

      return result.hash;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  environment(): { rpc: string; networkPassphrase: string } {
    return {
      rpc: this.serverUrl,
      networkPassphrase: this.networkPassphrase,
    };
  }
}

export const stellarService = new StellarService();
