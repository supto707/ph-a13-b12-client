import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, DollarSign, Wallet, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Withdrawals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [coinToWithdraw, setCoinToWithdraw] = useState('');
  const [paymentSystem, setPaymentSystem] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // 20 coins = 1 dollar, minimum 200 coins (10 dollars)
  const coinsValue = Number(coinToWithdraw) || 0;
  const withdrawAmount = coinsValue / 20;
  const hasEnoughCoins = (user?.coins || 0) >= 200;
  const isValidWithdraw = coinsValue >= 200 && coinsValue <= (user?.coins || 0);

  const handleWithdraw = () => {
    if (!isValidWithdraw || !paymentSystem || !accountNumber) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields correctly',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Withdrawal Request Submitted',
      description: `Your withdrawal of $${withdrawAmount.toFixed(2)} is being processed.`,
    });

    setCoinToWithdraw('');
    setPaymentSystem('');
    setAccountNumber('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Withdrawals</h1>
        <p className="text-muted-foreground">Convert your coins to real money</p>
      </div>

      {/* Balance Card */}
      <Card className="shadow-soft gradient-primary">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm mb-1">Your Current Balance</p>
              <div className="flex items-center gap-2">
                <Coins className="w-8 h-8 text-primary-foreground" />
                <span className="text-4xl font-bold text-primary-foreground">{user?.coins || 0}</span>
                <span className="text-primary-foreground/80">coins</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary-foreground/80 text-sm mb-1">Withdrawal Value</p>
              <div className="flex items-center gap-1">
                <DollarSign className="w-6 h-6 text-primary-foreground" />
                <span className="text-3xl font-bold text-primary-foreground">
                  {((user?.coins || 0) / 20).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="shadow-soft border-accent/20 bg-accent/5">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Withdrawal Information</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Exchange rate: <strong>20 coins = $1</strong></li>
                <li>• Minimum withdrawal: <strong>200 coins ($10)</strong></li>
                <li>• Processing time: 1-3 business days</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Withdrawal Form
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasEnoughCoins ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <p className="text-lg font-medium text-foreground mb-1">Insufficient Coins</p>
              <p className="text-muted-foreground">
                You need at least 200 coins to make a withdrawal.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coins">Coins to Withdraw</Label>
                  <Input
                    id="coins"
                    type="number"
                    placeholder="Minimum 200"
                    value={coinToWithdraw}
                    onChange={(e) => setCoinToWithdraw(e.target.value)}
                    min={200}
                    max={user?.coins || 0}
                  />
                  {coinToWithdraw && Number(coinToWithdraw) > (user?.coins || 0) && (
                    <p className="text-xs text-destructive">Exceeds available balance</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Withdrawal Amount ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="text"
                      value={withdrawAmount.toFixed(2)}
                      disabled
                      className="pl-10 bg-secondary"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment">Payment System</Label>
                <Select value={paymentSystem} onValueChange={setPaymentSystem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="rocket">Rocket</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account">Account Number</Label>
                <Input
                  id="account"
                  type="text"
                  placeholder="Enter your account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleWithdraw}
                disabled={!isValidWithdraw || !paymentSystem || !accountNumber}
              >
                Request Withdrawal
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Withdrawals;
