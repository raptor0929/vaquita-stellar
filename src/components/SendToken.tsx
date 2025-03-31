import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { IContract } from "@interfaces/contracts/contract.interface";
import { stellarService } from "@services/stellar.service";
import StellarExpertLink from "./StellarExpertLink";
import { walletService } from "@services/wallet.service";

interface IProps {
  readonly currentWallet: string;
}

export function SendTokens({ currentWallet }: IProps) {
  const [amount, setAmount] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("");
  const [hashId, setHashId] = useState<string>("");

  const handleSendTokens = async (e: React.FormEvent) => {
    e.preventDefault();

    const contractClient = await stellarService.buildClient<IContract>(
      currentWallet
    );

    const xdr = (
      await contractClient.deposit({
        from: currentWallet,
        to: receiver,
        amount: Number(amount),
      })
    ).toXDR();

    const signedTx = await walletService.signTransaction(xdr);

    const hashId = await stellarService.submitTransaction(signedTx.signedTxXdr);

    setHashId(hashId);
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <form onSubmit={handleSendTokens} className="flex flex-col gap-2 w-full">
        <Input
          label="Receiver"
          value={receiver}
          onChange={({ target }) => setReceiver(target.value)}
        />
        <Input
          label="Amount"
          value={amount}
          onChange={({ target }) => setAmount(target.value)}
        />

        <Button>Send Tokens</Button>
      </form>

      {hashId && <StellarExpertLink url={hashId} />}
    </div>
  );
}
