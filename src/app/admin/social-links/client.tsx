'use client';
import { useState, useEffect } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import type { SocialLink } from '@/lib/types';
import { getSocialLinks, addSocialLink, updateSocialLink, deleteSocialLink } from '@/lib/services/social-links';
import { SocialLinksTable } from './components/social-links-table';
import { SocialLinkForm } from './components/social-link-form';

export function SocialLinksClientPage() {
  const { toast } = useToast();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<SocialLink | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    getSocialLinks()
      .then(setLinks)
      .catch(err => toast({ variant: 'destructive', title: 'Error fetching social links' }))
      .finally(() => setLoading(false));
  }, [toast]);

  const handleAdd = () => {
    setSelectedLink(undefined);
    setOpen(true);
  };

  const handleEdit = (link: SocialLink) => {
    setSelectedLink(link);
    setOpen(true);
  };
  
  const handleDelete = async (linkId: string) => {
    try {
        await deleteSocialLink(linkId);
        setLinks(prev => prev.filter(l => l.id !== linkId));
        toast({ title: 'Social Link Deleted' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Failed to delete link' });
    }
  }

  const onFormSubmit = async (values: Omit<SocialLink, 'id'>, id?: string) => {
    try {
      if (id) {
        await updateSocialLink(id, values);
        setLinks(prev => prev.map(l => l.id === id ? { ...l, ...values, id } : l));
        toast({ title: 'Social Link Updated' });
      } else {
        const newId = await addSocialLink(values);
        setLinks(prev => [...prev, { id: newId, ...values }]);
        toast({ title: 'Social Link Added' });
      }
      setOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Save failed' });
    }
  };

  return (
    <>
       <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Social Links</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </div>
        </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Social Media Links</CardTitle>
          <CardDescription>Add, edit, and control the visibility of social links in your site's footer.</CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <SocialLinksTable links={links} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{selectedLink ? 'Edit' : 'Add'} Social Link</DialogTitle>
          </DialogHeader>
          <SocialLinkForm
            link={selectedLink}
            onSubmit={onFormSubmit}
            onFinished={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
