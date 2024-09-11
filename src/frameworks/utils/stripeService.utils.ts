import Stripe from "stripe";
import IStripeService from "../../interface/utils/IStripeService.utils";
import { ISeatPayAmountData } from "../../entity/screen.entity";

export default class StripeService implements IStripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);    
    }

    async createCheckoutSessionForBookingSeat(scheduleId: string, itemData: ISeatPayAmountData[]): Promise<string> {
        try {
            const checkoutSession = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: itemData.map((seat) => {
                    return {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: seat.category,
                            },
                            unit_amount: seat.price * 100,
                        },
                        quantity: seat.quantity,
                    }
                }),
                mode: 'payment', // This session is for a one-time payment
                success_url: `${process.env.FRONT_END_DOMAIN}/paymentsuccess?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONT_END_DOMAIN}/bookseat/${scheduleId}`,
            });

            return checkoutSession.id
        } catch (err: any) {
            throw err;
        }
    }

    async retriveCheckoutSession(checkoutSessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session> | never> {
        try {
            return await this.stripe.checkout.sessions.retrieve(checkoutSessionId);
        } catch (err: any) {
            throw err;
        }
    }

    async retrivePaymentIntent(paymentIntentId: string): Promise<Stripe.Response<Stripe.PaymentIntent> | never> {
        try {
            return await this.stripe.paymentIntents.retrieve(paymentIntentId);
        } catch (err: any) {
            throw err;
        }
    }
}