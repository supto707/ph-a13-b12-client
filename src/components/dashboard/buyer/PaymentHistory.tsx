import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Calendar, CreditCard } from 'lucide-react';

const mockPayments = [
  { id: 1, coinsPurchased: 500, amountPaid: 20, paymentDate: new Date('2024-01-25') },
  { id: 2, coinsPurchased: 150, amountPaid: 10, paymentDate: new Date('2024-01-20') },
  { id: 3, coinsPurchased: 1000, amountPaid: 35, paymentDate: new Date('2024-01-15') },
  { id: 4, coinsPurchased: 10, amountPaid: 1, paymentDate: new Date('2024-01-10') },
];

const PaymentHistory = () => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const totalSpent = mockPayments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalCoins = mockPayments.reduce((sum, p) => sum + p.coinsPurchased, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Payment History</h1>
        <p className="text-muted-foreground">View all your coin purchases</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            <CreditCard className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">${totalSpent}</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft gradient-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-accent-foreground/80">Total Coins Purchased</CardTitle>
            <Coins className="w-5 h-5 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent-foreground">{totalCoins.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-display">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {mockPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Coins</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPayments.map((payment) => (
                    <tr key={payment.id} className="border-b last:border-0 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {formatDate(payment.paymentDate)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-foreground font-medium">
                          <Coins className="w-4 h-4 text-accent" />
                          +{payment.coinsPurchased}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground font-medium">${payment.amountPaid}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No payment history yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistory;
