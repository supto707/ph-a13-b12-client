import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { paymentAPI } from '@/lib/api';
import { Coins, CreditCard, Check, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const coinPackages = [
  { id: 1, coins: 10, price: 1, popular: false },
  { id: 2, coins: 150, price: 10, popular: false },
  { id: 3, coins: 500, price: 20, popular: true },
  { id: 4, coins: 1000, price: 35, popular: false },
];

const PurchaseCoins = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<typeof coinPackages[0] | null>(null);

  const handlePackageSelect = async (pkg: typeof coinPackages[0]) => {
    setProcessingId(pkg.id);
    setSelectedPkg(pkg);

    try {
      const response = await paymentAPI.createPaymentIntent({ packageId: pkg.id });
      setClientSecret(response.data.clientSecret);
    } catch (error: any) {
      console.error('Payment intent error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to initialize payment',
        variant: 'destructive',
      });
      setSelectedPkg(null);
    } finally {
      setProcessingId(null);
    }
  };

  const handlePaymentSuccess = async () => {
    setClientSecret(null);
    setSelectedPkg(null);
    await refreshUser();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Purchase Coins</h1>
        <p className="text-muted-foreground">Buy coins to post tasks and pay workers</p>
      </div>

      {/* Current Balance */}
      <Card className="shadow-soft gradient-primary">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm mb-1">Current Balance</p>
              <div className="flex items-center gap-2">
                <Coins className="w-8 h-8 text-primary-foreground" />
                <span className="text-4xl font-bold text-primary-foreground">{user?.coins || 0}</span>
                <span className="text-primary-foreground/80">coins</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coin Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {coinPackages.map((pkg, index) => (
          <Card
            key={pkg.id}
            className={`shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 relative overflow-hidden animate-slide-up stagger-${index + 1} ${pkg.popular ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
          >
            {pkg.popular && (
              <div className="absolute top-0 right-0 gradient-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                BEST VALUE
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <div className={`w-16 h-16 mx-auto mb-2 rounded-2xl flex items-center justify-center ${pkg.popular ? 'gradient-primary shadow-glow' : 'bg-accent/10'
                }`}>
                <Coins className={`w-8 h-8 ${pkg.popular ? 'text-primary-foreground' : 'text-accent'}`} />
              </div>
              <CardTitle className="font-display text-3xl">{pkg.coins}</CardTitle>
              <p className="text-muted-foreground">coins</p>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-bold text-foreground">${pkg.price}</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  Instant delivery
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  No expiry
                </li>
              </ul>
              <Button
                className="w-full"
                variant={pkg.popular ? 'default' : 'outline'}
                onClick={() => handlePackageSelect(pkg)}
                disabled={processingId === pkg.id}
              >
                {processingId === pkg.id ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4 mr-2" />
                )}
                {processingId === pkg.id ? 'Loading...' : 'Buy Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stripe Payment Dialog */}
      <Dialog open={!!clientSecret} onOpenChange={(open) => !open && setClientSecret(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Purchase</DialogTitle>
            <DialogDescription>
              Purchase {selectedPkg?.coins} coins for ${selectedPkg?.price}
            </DialogDescription>
          </DialogHeader>

          {clientSecret && selectedPkg && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                clientSecret={clientSecret}
                packageId={selectedPkg.id}
                coins={selectedPkg.coins}
                price={selectedPkg.price}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setClientSecret(null)}
              />
            </Elements>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Info */}
      <Card className="shadow-soft border-muted">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                All payments are processed securely by Stripe. We accept all major credit cards.
                Your payment information is encrypted and never stored on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseCoins;
