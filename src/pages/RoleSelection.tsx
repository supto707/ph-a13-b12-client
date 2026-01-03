import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userAPI } from '@/lib/api';
import { Coins, Briefcase, HardHat, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { UserRole } from '@/types';

const RoleSelection = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, refreshUser } = useAuth();
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // If user already has a role set (not from Google signup pending), redirect to dashboard
    if (user && user.role !== 'worker' && localStorage.getItem('pending_role_selection') !== 'true') {
        navigate('/dashboard');
        return null;
    }

    const handleRoleSelect = async () => {
        if (!selectedRole || !user) return;

        setIsLoading(true);
        try {
            await userAPI.updateRole(user._id, selectedRole);
            await refreshUser();
            localStorage.removeItem('pending_role_selection');

            toast({
                title: 'Welcome to MicroTask!',
                description: `You've joined as a ${selectedRole}. You received ${selectedRole === 'worker' ? '10' : '50'} bonus coins!`,
            });

            navigate('/dashboard');
        } catch (error: unknown) {
            console.error('Failed to set role:', error);
            toast({
                title: 'Error',
                description: (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to set your role',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const roles = [
        {
            id: 'worker' as UserRole,
            title: 'Worker',
            icon: HardHat,
            description: 'Complete micro-tasks posted by buyers and earn coins for each one.',
            benefits: [
                'Earn coins by completing simple tasks',
                'Work on your own schedule',
                'Cash out anytime (min. 200 coins)',
                '10 bonus coins on signup',
            ],
            color: 'from-green-500 to-emerald-600',
            bonusCoins: 10,
        },
        {
            id: 'buyer' as UserRole,
            title: 'Buyer',
            icon: Briefcase,
            description: 'Post tasks and hire workers to complete them for coins.',
            benefits: [
                'Post unlimited tasks',
                'Get work done quickly by many workers',
                'Review and approve submissions',
                '50 bonus coins on signup',
            ],
            color: 'from-blue-500 to-indigo-600',
            bonusCoins: 50,
        },
    ];

    return (
        <MainLayout>
            <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-3xl animate-fade-in">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                            <Coins className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                            Choose Your Path
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            How would you like to use MicroTask?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {roles.map((role) => (
                            <Card
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                className={`cursor-pointer transition-all duration-300 hover:shadow-medium hover:-translate-y-1 ${selectedRole === role.id
                                    ? 'ring-2 ring-primary shadow-glow'
                                    : 'border-border/50'
                                    }`}
                            >
                                <CardHeader>
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}>
                                        <role.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <CardTitle className="font-display text-xl flex items-center justify-between">
                                        {role.title}
                                        <span className="text-sm font-normal text-accent">
                                            +{role.bonusCoins} coins
                                        </span>
                                    </CardTitle>
                                    <CardDescription>{role.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {role.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="text-success">✓</span>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Button
                            size="lg"
                            onClick={handleRoleSelect}
                            disabled={!selectedRole || isLoading}
                            className="gap-2 px-8"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Setting up your account...
                                </>
                            ) : (
                                <>
                                    Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.title : '...'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default RoleSelection;
