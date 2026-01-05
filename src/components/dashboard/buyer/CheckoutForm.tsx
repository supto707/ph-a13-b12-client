import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { paymentAPI } from '@/lib/api';

interface CheckoutFormProps {
    clientSecret: string;
    packageId: number;
    coins: number;
    price: number;
    onSuccess: () => void;
    onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
    clientSecret,
    packageId,
    coins,
    price,
    onSuccess,
    onCancel
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const { toast } = useToast();
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setProcessing(false);
            return;
        }

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                toast({
                    title: 'Payment Failed',
                    description: error.message,
                    variant: 'destructive',
                });
                setProcessing(false);
            } else if (paymentIntent.status === 'succeeded') {
                // Confirm with our backend
                await paymentAPI.confirmPayment({
                    paymentIntentId: paymentIntent.id,
                    packageId,
                });

                toast({
                    title: 'Payment Successful!',
                    description: `${coins} coins have been added to your account.`,
                });
                onSuccess();
            }
        } catch (err: any) {
            console.error('Payment confirmation error:', err);
            toast({
                title: 'Error',
                description: err.response?.data?.error || 'Failed to confirm payment with server.',
                variant: 'destructive',
            });
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border rounded-lg bg-accent/5">
                <label className="text-sm font-medium mb-2 block">Card Details</label>
                <div className="p-3 border rounded-md bg-background">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                    disabled={processing}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex-1"
                    disabled={!stripe || processing}
                >
                    {processing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay ${price}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default CheckoutForm;
