import { useState, useEffect } from 'react';
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
import { withdrawalAPI } from '@/lib/api';
import { Coins, DollarSign, Wallet, AlertCircle, Loader2, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Withdrawal } from '@/types';

const Withdrawals = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [coinToWithdraw, setCoinToWithdraw] = useState('');
  const [paymentSystem, setPaymentSystem] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 20 coins = 1 dollar, minimum 200 coins (10 dollars)
  const coinsValue = Number(coinToWithdraw) || 0;
  const withdrawAmount = coinsValue / 20;
  const hasEnoughCoins = (user?.coins || 0) >= 200;
  const isValidWithdraw = coinsValue >= 200 && coinsValue <= (user?.coins || 0);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await withdrawalAPI.getWorkerWithdrawals();
        setWithdrawals(response.data);
      } catch (error) {
        console.error('Failed to fetch withdrawals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const handleWithdraw = async () => {
    if (!isValidWithdraw || !paymentSystem || !accountNumber) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields correctly',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await withdrawalAPI.create({
        withdrawalCoin: coinsValue,
        paymentSystem,
        accountNumber,
      });

      toast({
        title: 'Withdrawal Request Submitted',
        description: `Your withdrawal of $${withdrawAmount.toFixed(2)} is pending approval.`,
      });

      // Refresh user and withdrawals
      await refreshUser();
      const response = await withdrawalAPI.getWorkerWithdrawals();
      setWithdrawals(response.data);

      setCoinToWithdraw('');
      setPaymentSystem('');
      setAccountNumber('');
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to submit withdrawal request',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
                className="w-full gap-2"
                onClick={handleWithdraw}
                disabled={!isValidWithdraw || !paymentSystem || !accountNumber || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wallet className="w-4 h-4" />
                )}
                {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      {withdrawals.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display">Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Coins</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Method</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="border-b last:border-0 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 text-muted-foreground">{formatDate(withdrawal.createdAt)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-accent" />
                          {withdrawal.withdrawalCoin}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">${withdrawal.withdrawalAmount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-muted-foreground capitalize">{withdrawal.paymentSystem}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium capitalize ${withdrawal.status === 'approved'
                            ? 'bg-success/10 text-success'
                            : 'bg-accent/10 text-accent'
                          }`}>
                          {withdrawal.status === 'approved' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {withdrawal.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Withdrawals;
