export enum PaymentState {
  FiatPaymentInitiating = 0,
  FiatPaymentInitiated = 1,
  FiatPaymentCompleted = 2,
  FiatPaymentFailed = 3,
  TokenTransferIntiating = 4,
  TokenTransferInitiated = 5,
  TokenTransferFailed = 6,
  TokenTransferCompleted = 7,
}
