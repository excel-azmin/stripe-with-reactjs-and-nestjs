import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentRequestBody } from './types/PaymentRequestBody';

@Injectable()
export class PaymentsService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(process.env.API_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });
  }

  createPayment(paymentRequestBody: PaymentRequestBody): Promise<any> {

    console.log('Payment request body:', paymentRequestBody);
     // Validate the products array
     if (!Array.isArray(paymentRequestBody.products)) {
      throw new Error('Invalid products array in payment request body');
    }

    let sumAmount = 0;
    paymentRequestBody.products.forEach((product) => {
      sumAmount = sumAmount + product.price * product.quantity;
    });

    // Log the calculated amount
    console.log('Total amount:', sumAmount);

    try {
      return this.stripe.paymentIntents.create({
        amount: sumAmount * 100,
        currency: paymentRequestBody.currency,
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }
}
