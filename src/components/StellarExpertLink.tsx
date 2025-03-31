export default function StellarExpertLink({ url }: { url: string }) {
  return (
    <a
      href={`https://stellar.expert/explorer/testnet/tx/${url}`}
      target="_blank"
    >
      Ver en explorer
    </a>
  );
}
