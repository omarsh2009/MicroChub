'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { ContactInfo } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export function ContactInfoClientPage({ contactInfo: initialContactInfo }: { contactInfo: ContactInfo }) {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setContactInfo(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
        toast({ title: 'Saved (Demo)', description: 'Contact information would be updated in a real application.' });
        setIsSaving(false);
    }, 500);
  };


  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Contact Information</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Public Contact Details</CardTitle>
          <CardDescription>
            Update the contact information displayed on your website's contact page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={contactInfo.location} onChange={handleChange} />
                </div>
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
                 <div className="space-y-2">
                    <Label htmlFor="googleMapsLink">Google Maps Embed Link (Optional)</Label>
                    <Input id="googleMapsLink" value={contactInfo.googleMapsLink || ''} onChange={handleChange} />
                </div>
            </div>
             <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </CardContent>
      </Card>
    </>
  );
}
