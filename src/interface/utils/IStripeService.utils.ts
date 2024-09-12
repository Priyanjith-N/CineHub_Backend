import Stripe from "stripe";
import { ISeatPayAmountData } from "../../entity/screen.entity";

export default interface IStripeService {
    createCheckoutSessionForBookingSeat(scheduleId: string, itemData: ISeatPayAmountData[]): Promise<string | never>;
    retriveCheckoutSession(checkoutSessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session> | never>;
    retrivePaymentIntent(paymentIntentId: string): Promise<Stripe.Response<Stripe.PaymentIntent> | never>;
    initiateRefund(paymentIntentId: string, amountToRefund: number): Promise<void | never>;
}