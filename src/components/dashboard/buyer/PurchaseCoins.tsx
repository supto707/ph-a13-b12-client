import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, CreditCard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const coinPackages = [
  { coins: 10, price: 1, popular: false },
  { coins: 150, price: 10, popular: false },
  { coins: 500, price: 20, popular: true },
  { coins: 1000, price: 35, popular: false },
];

const PurchaseCoins = () => {
  const { user, updateUserCoins } = useAuth();
  const { toast } = useToast();

  const handlePurchase = (coins: number, price: number) => {
    // Simulate payment processing
    updateUserCoins((user?.coins || 0) + coins);
    toast({
      title: 'Purchase Successful!',
      description: `${coins} coins have been added to your account.`,
    });
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
            key={pkg.coins}
            className={`shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 relative overflow-hidden animate-slide-up stagger-${index + 1} ${
              pkg.popular ? 'border-primary ring-2 ring-primary/20' : ''
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-0 right-0 gradient-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                BEST VALUE
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <div className={`w-16 h-16 mx-auto mb-2 rounded-2xl flex items-center justify-center ${
                pkg.popular ? 'gradient-primary shadow-glow' : 'bg-accent/10'
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
                onClick={() => handlePurchase(pkg.coins, pkg.price)}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

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
                All payments are processed securely. We accept all major credit cards and PayPal.
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
