import { useState } from "react";
import Input from "./Input";
import { stellarService } from "@services/stellar.service";
import { IContract } from "@interfaces/contracts/contract.interface";
import { walletService } from "@services/wallet.service";
import Button from "./Button";
import StellarExpertLink from "./StellarExpertLink";

interface IProps {
  readonly adminWallet: string;
}

export default function CreateClient({ adminWallet }: IProps) {
  const [clientWallet, setClientWallet] = useState<string>("");
  const [hashId, setHashId] = useState<string>("");

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    const contractClient = await stellarService.buildClient<IContract>(
      adminWallet
    );
    const xdr = (
      await contractClient.add_client({
        client: clientWallet,
        balance: 0,
      })
    ).toXDR();

    const signedTx = await walletService.signTransaction(xdr);

    const hashId = await stellarService.submitTransaction(signedTx.signedTxXdr);

    setHashId(hashId);
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <form
        onSubmit={handleCreateClient}
        className="flex flex-col gap-2 w-full"
      >
        <Input
          label="Client Wallet"
          value={clientWallet}
          onChange={({ target }) => setClientWallet(target.value)}
        />

        <Button>Create Client</Button>
      </form>

      {hashId && <StellarExpertLink url={hashId} />}
    </div>
  );
}
