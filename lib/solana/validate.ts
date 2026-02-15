import { PublicKey } from "@solana/web3.js";

export function isValidSolanaAddress(address: string) {
  try {
    // SPL mints don't need to be on-curve; constructor validation is enough.
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}
