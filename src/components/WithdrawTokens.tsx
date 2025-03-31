import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { stellarService } from "@services/stellar.service";
import { walletService } from "@services/wallet.service";
import { IContract } from "@interfaces/contracts/contract.interface";
import StellarExpertLink from "./StellarExpertLink";

export default function WithdrawTokens() {
  const [receiver, setReceiver] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [hashId, setHashId] = useState<string>("");

  const handleSubmitWithdrawTokens = async (e: React.FormEvent) => {
    e.preventDefault();

    const contractClient = await stellarService.buildClient<IContract>(
      receiver
    );

    const xdr = (
      await contractClient.withdraw({
        recieve: receiver,
        amount: Number(amount),
      })
    ).toXDR();

    const signedTx = await walletService.signTransaction(xdr);

    const hashId = await stellarService.submitTransaction(signedTx.signedTxXdr);

    setHashId(hashId);
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <form
        onSubmit={handleSubmitWithdrawTokens}
        className="flex flex-col gap-2 w-full"
      >
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

        <Button>Withdraw Tokens</Button>
      </form>

      {hashId && <StellarExpertLink url={hashId} />}
    </div>
  );
}
