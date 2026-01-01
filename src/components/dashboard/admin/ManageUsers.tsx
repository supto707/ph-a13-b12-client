import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Coins, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';

const mockUsers = [
  { id: '1', name: 'John Worker', email: 'john@test.com', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', role: 'worker' as UserRole, coins: 250 },
  { id: '2', name: 'Sarah Buyer', email: 'sarah@test.com', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', role: 'buyer' as UserRole, coins: 500 },
  { id: '3', name: 'Jane Doe', email: 'jane@test.com', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', role: 'worker' as UserRole, coins: 180 },
  { id: '4', name: 'Mike Johnson', email: 'mike@test.com', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', role: 'buyer' as UserRole, coins: 1200 },
  { id: '5', name: 'Emily Davis', email: 'emily@test.com', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily', role: 'worker' as UserRole, coins: 75 },
];

const ManageUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast({
      title: 'Role Updated',
      description: `User role has been changed to ${newRole}`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: 'User Deleted',
      description: 'The user has been removed from the platform',
      variant: 'destructive',
    });
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive/10 text-destructive';
      case 'buyer':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-success/10 text-success';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Manage Users</h1>
        <p className="text-muted-foreground">View and manage all platform users</p>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-display">All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Coins</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.photoUrl} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadgeStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-foreground">
                        <Coins className="w-4 h-4 text-accent" />
                        {user.coins}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Select
                          value={user.role}
                          onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                        >
                          <SelectTrigger className="w-28 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="worker">Worker</SelectItem>
                            <SelectItem value="buyer">Buyer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsers;
