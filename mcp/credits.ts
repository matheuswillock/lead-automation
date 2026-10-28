export function sumCredits(...ledgers: Array<{ creditsUsed: number }>) {
  return ledgers.reduce((sum, ledger) => sum + ledger.creditsUsed, 0);
}
