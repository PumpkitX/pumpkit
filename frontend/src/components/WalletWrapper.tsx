"use client";
import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from "@coinbase/onchainkit/wallet";
import { base } from "viem/chains";

type WalletWrapperParams = {
  text?: string;
  className?: string;
};
export default function WalletWrapper({
  className,
  text,
}: WalletWrapperParams) {
  return (
    <div id="wallet-component">
      <Wallet>
        <ConnectWallet text={text} className={className}>
          <div className="sr-only" id="connect-wallet"></div>
          <Avatar className="h-6 w-6" chain={base} />
          <Name chain={base} />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true}>
            <Avatar chain={base} />
            <Name chain={base} />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownBasename />
          <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
            Go to Wallet Dashboard
          </WalletDropdownLink>
          {/* <WalletDropdownFundLink /> */}
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
