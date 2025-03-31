import { ClientOptions } from "@stellar/stellar-sdk/contract";

export interface IBaseContractClient {
  readonly options: ClientOptions;
  toXDR(): string;
}

export interface IContract extends IBaseContractClient {
  initialize: ({
    admin,
    token,
  }: {
    admin: string;
    token: string;
  }) => Promise<this>;
  get_admin: () => Promise<this>;
  add_client: ({
    client,
    balance,
  }: {
    client: string;
    balance: number;
  }) => Promise<this>;
  update_client: ({
    address,
    status,
  }: {
    address: string;
    status: boolean;
  }) => Promise<this>;
  remove_client: ({ client }: { client: string }) => Promise<this>;
  add_recieve: ({
    recieve,
    balance,
  }: {
    recieve: string;
    balance: number;
  }) => Promise<this>;
  remove_recieve: ({ recieve }: { recieve: string }) => Promise<this>;
  amount_to_withdraw: ({ recieve }: { recieve: string }) => Promise<this>;
  deposit: ({
    from,
    to,
    amount,
  }: {
    from: string;
    to: string;
    amount: number;
  }) => Promise<this>;
  withdraw: ({
    recieve,
    amount,
  }: {
    recieve: string;
    amount: number;
  }) => Promise<this>;
}
