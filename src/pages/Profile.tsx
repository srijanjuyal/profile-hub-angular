
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navigate } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  avatar: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const Profile: React.FC = () => {
  const { user, isLoading, updateProfile, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    }
  });
  
  const onSubmit = async (data: FormData) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">My Profile</CardTitle>
          <CardDescription className="text-center">
            View and manage your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-xl bg-brand-100 text-brand-700">{user ? getInitials(user.name) : 'U'}</AvatarFallback>
            </Avatar>
          </div>
          
          {!isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div className="font-semibold text-muted-foreground">Name</div>
                <div>{user?.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div className="font-semibold text-muted-foreground">Email</div>
                <div>{user?.email}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="font-semibold text-muted-foreground">User ID</div>
                <div className="text-sm text-muted-foreground">{user?.id}</div>
              </div>
              <div className="pt-4">
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-brand-600 hover:bg-brand-700"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} disabled={true} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/avatar.jpg" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">Enter a URL to an image</p>
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-brand-600 hover:bg-brand-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
