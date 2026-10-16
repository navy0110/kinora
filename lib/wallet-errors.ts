export function walletError(error: unknown): string {
  let current = error;
  for (let i = 0; i < 8 && current && typeof current === 'object'; i++) {
    const item = current as { code?: number; name?: string; message?: string; cause?: unknown };
    if (item.code === 4001 || item.name === 'UserRejectedRequestError') return 'Request cancelled in your wallet. Nothing was published by this attempt.';
    if (item.code === -32002) return 'A wallet request is already open. Check your wallet before trying again.';
    if (item.name === 'InsufficientFundsError' || /insufficient funds|insufficient balance/i.test(item.message || '')) return 'Not enough test GLM. Use the Tiramisu faucet, then check your balance again.';
    current = item.cause;
  }
  return error instanceof Error ? error.message : 'The wallet request failed. Check your wallet and try again.';
}
