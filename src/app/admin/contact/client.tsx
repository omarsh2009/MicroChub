'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { ContactInfo } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

export function ContactInfoClientPage({ contactInfo: initialContactInfo }: { contactInfo: ContactInfo }) {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setContactInfo(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSwitchChange = (id: keyof ContactInfo) => (checked: boolean) => {
    const value = id === 'storeStatus' ? (checked ? 'open' : 'closed') : checked;
    setContactInfo(prev => ({ ...prev, [id]: value as any }));
  };
  
  const handleRadioChange = (id: keyof ContactInfo) => (value: string) => {
      setContactInfo(prev => ({...prev, [id]: value as any }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
        // In a real app, this would update the backend.
        // Here we just show a toast.
        console.log("Updated Contact Info (Demo):", contactInfo);
        toast({ title: 'Saved (Demo)', description: 'Contact information would be updated in a real application.' });
        setIsSaving(false);
    }, 500);
  };


  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Contact & Store Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Public Contact & Store Details</CardTitle>
          <CardDescription>
            Update contact information, store hours, and control your store's operational status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Card className="p-4 bg-muted/30">
                 <CardHeader className="p-2">
                    <CardTitle className="text-xl">Store Controls</CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-6">
                     <FormField
                        control={undefined}
                        name="storeStatus"
                        render={() => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Store Status</FormLabel>
                                    <FormDescription>
                                        Turn your store on or off. When closed, ordering is disabled.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={contactInfo.storeStatus === 'open'}
                                        onCheckedChange={handleSwitchChange('storeStatus')}
                                        aria-label="Toggle Store Status"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={undefined}
                        name="storeMode"
                        render={() => (
                           <FormItem className="space-y-3">
                              <FormLabel className="text-base">Store Mode</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={handleRadioChange('storeMode')}
                                  defaultValue={contactInfo.storeMode}
                                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="online" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Online Store
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="physical" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Physical Store
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                        />
                </CardContent>
            </Card>

            <Card className="p-4">
                 <CardHeader className="p-2">
                    <CardTitle className="text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-6">
                    {contactInfo.storeMode === 'online' ? (
                        <div className="space-y-2">
                            <Label htmlFor="pickupInstructions">Pickup Instructions</Label>
                            <Textarea id="pickupInstructions" value={contactInfo.pickupInstructions} onChange={handleChange} placeholder="e.g. Pickup from our partner location in Nasr City..." />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="location">Store Location</Label>
                            <Input id="location" value={contactInfo.location} onChange={handleChange} />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={contactInfo.email} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={contactInfo.phone} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="workingDays">Working Days</Label>
                            <Input id="workingDays" value={contactInfo.workingDays} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="workingHours">Working Hours</Label>
                            <Input id="workingHours" value={contactInfo.workingHours} onChange={handleChange} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="googleMapsLink">Google Maps Embed Link (Optional)</Label>
                        <Input id="googleMapsLink" value={contactInfo.googleMapsLink || ''} onChange={handleChange} />
                    </div>
                </CardContent>
            </Card>

             <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </CardContent>
      </Card>
    </>
  );
}

// Dummy components to satisfy TS since we are not using react-hook-form here
const FormField = ({ render }: { control: any, name: string, render: () => React.ReactNode }) => render();
const FormItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={className} {...props} />;
const FormLabel = (props: React.ComponentProps<typeof Label>) => <Label {...props} />;
const FormControl = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const FormDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p className={`text-sm text-muted-foreground ${className}`} {...props} />;
const FormMessage = () => null;

    