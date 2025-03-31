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

export default function CreateReciever({ adminWallet }: IProps) {
  const [recieverWallet, setRecieverWallet] = useState<string>("");
  const [hashId, setHashId] = useState<string>("");

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    const contractClient = await stellarService.buildClient<IContract>(
      adminWallet
    );
    const xdr = (
      await contractClient.add_recieve({
        recieve: recieverWallet,
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
          label="Receiver Wallet"
          value={recieverWallet}
          onChange={({ target }) => setRecieverWallet(target.value)}
        />

        <Button>Create Reciever</Button>
      </form>

      {hashId && <StellarExpertLink url={hashId} />}
    </div>
  );
}
