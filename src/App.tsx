import { useEffect, useState } from "react";
import "./App.css";
import Button from "./components/Button";
import Input from "./components/Input";
import { stellarService } from "@services/stellar.service";
import { IContract } from "@interfaces/contracts/contract.interface";
import { walletService } from "@services/wallet.service";
import CreateClient from "./components/CreateClient";
import StellarExpertLink from "./components/StellarExpertLink";
import CreateReciever from "./components/CreateReceiver";
import { SendTokens } from "./components/SendToken";
import WithdrawTokens from "./components/WithdrawTokens";
import { Divider } from "./components/Divider";

enum View {
  INITIALIZE = "INITIALIZE",
  DEPOSIT = "DEPOSIT",
  CREATE = "CREATE",
  WITHDRAW = "WITHDRAW",
}

function App() {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [admin, setAdmin] = useState<string>("");
  const [nativeToken, setNativeToken] = useState<string>("");
  const [signedTxXdr, setSignedTxXdr] = useState<string>("");
  const [hashId, setHashId] = useState<string>("");

  const [view, setView] = useState<View>(View.INITIALIZE);

  useEffect(() => {
    async function connectWallet() {
      const wallet = await walletService.connect();

      setCurrentAccount(wallet);
    }
    connectWallet();
  }, []);

  const handleInitializeContract = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const client = await stellarService.buildClient<IContract>(currentAccount);
    const xdr = (
      await client.initialize({
        admin: admin,
        token: nativeToken,
      })
    ).toXDR();

    const signedTx = await walletService.signTransaction(xdr);

    setSignedTxXdr(signedTx.signedTxXdr);
  };

  const handleSubmitTransaction = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const hashId = await stellarService.submitTransaction(signedTxXdr);

    setHashId(hashId);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <h1>Bienvenidos al workshop organizado por BAF</h1>

      <nav className="flex gap-4 p-4">
        <Button onClick={() => setView(View.INITIALIZE)}>Initialize</Button>
        <Button onClick={() => setView(View.CREATE)}>Create clients</Button>
        <Button onClick={() => setView(View.DEPOSIT)}>Deposit</Button>
        <Button onClick={() => setView(View.WITHDRAW)}>Withdraw</Button>
      </nav>

      <Input label="Cuenta" value={currentAccount} disabled={true} />

      {view === View.INITIALIZE && (
        <>
          <Divider />

          <h2>Initialize</h2>
          <Input
            label="GX3SGA..."
            value={admin}
            onChange={({ target }) => setAdmin(target.value)}
          />

          <Input
            label="Native token"
            value={nativeToken}
            onChange={({ target }) => setNativeToken(target.value)}
          />

          <Button onClick={handleInitializeContract}>
            Inicializar contrato
          </Button>

          {signedTxXdr.length > 0 && (
            <>
              <textarea
                disabled
                value={signedTxXdr}
                className="w-full bg-slate-100 text-slate-700 rounded-xl p-2"
                rows={10}
                cols={40}
              ></textarea>

              <Button onClick={handleSubmitTransaction}>
                Submitear transaccion a la red
              </Button>

              {hashId.length > 0 && <StellarExpertLink url={hashId} />}
            </>
          )}
        </>
      )}

      {view === View.CREATE && (
        <>
          <Divider />

          <h2>Create clients</h2>
          <CreateClient adminWallet={currentAccount} />
          <CreateReciever adminWallet={currentAccount} />
        </>
      )}

      {view === View.DEPOSIT && (
        <>
          <Divider />

          <h2>Send tokens</h2>
          <SendTokens currentWallet={currentAccount} />
        </>
      )}

      {view === View.WITHDRAW && (
        <>
          <Divider />

          <h2>Withdraw tokens</h2>
          <WithdrawTokens />
        </>
      )}
    </div>
  );
}

export default App;
