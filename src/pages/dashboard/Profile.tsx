import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { userAPI, uploadImage } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Camera, User, Mail, Shield, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Profile = () => {
    const { user, refreshUser } = useAuth();
    const { toast } = useToast();

    // Form state
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    // UI state
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setPhotoPreview(user.photoUrl);
        }
    }, [user]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            let photoUrl = user.photoUrl;

            // Upload new photo if selected
            if (photo) {
                photoUrl = await uploadImage(photo);
            }

            // Update profile
            await userAPI.updateProfile(user._id, {
                name,
                photoUrl
            });

            // Refresh context and exit edit mode
            await refreshUser();
            setIsEditing(false);
            setPhoto(null);

            toast({
                title: "Profile Updated",
                description: "Your information has been successfully updated.",
            });
        } catch (error) {
            console.error('Update profile error:', error);
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Card */}
                <Card className="flex-1 glass-card border-white/5">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4 relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-glow relative">
                                <Avatar className="w-full h-full">
                                    <AvatarImage src={photoPreview || user.photoUrl} className="object-cover" />
                                    <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            {isEditing && (
                                <label
                                    htmlFor="photo-upload"
                                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                                >
                                    <Camera className="w-5 h-5" />
                                    <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                </label>
                            )}
                        </div>
                        <CardTitle className="text-3xl font-bold font-display">{user.name}</CardTitle>
                        <CardDescription className="text-lg flex items-center justify-center gap-2 mt-2">
                            <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase tracking-wide">
                                {user.role}
                            </Badge>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-white/5">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                    <Coins className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Coin Balance</p>
                                    <p className="text-2xl font-bold">{user.coins}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-white/5">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">User Status</p>
                                    <p className="text-lg font-bold text-green-500">Active</p>
                                </div>
                            </div>
                        </div>

                        {!isEditing ? (
                            <div className="space-y-4 pt-4">
                                <div className="grid gap-2">
                                    <Label className="text-muted-foreground">Email Address</Label>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-white/5">
                                        <Mail className="w-5 h-5 text-muted-foreground" />
                                        <span className="font-medium">{user.email}</span>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-muted-foreground">Join Date</Label>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-white/5">
                                        <span className="font-medium text-muted-foreground">
                                            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full gradient-primary shadow-glow mt-4"
                                >
                                    Edit Profile
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 pt-4 animate-slide-up">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="pl-10 bg-background/50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-muted-foreground">Email Address (Read-only)</Label>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-white/5 opacity-70">
                                        <Mail className="w-5 h-5 text-muted-foreground" />
                                        <span className="font-medium">{user.email}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setName(user.name);
                                            setPhoto(null);
                                            setPhotoPreview(user.photoUrl);
                                        }}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 gradient-primary shadow-glow"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
