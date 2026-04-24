'use client';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
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
import { SocialLinksTable } from './components/social-links-table';
import { SocialLinkForm } from './components/social-link-form';

export function SocialLinksClientPage({ links: initialLinks }: { links: SocialLink[] }) {
  const { toast } = useToast();
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [open, setOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<SocialLink | undefined>(undefined);

  const handleAdd = () => {
    setSelectedLink(undefined);
    setOpen(true);
  };

  const handleEdit = (link: SocialLink) => {
    setSelectedLink(link);
    setOpen(true);
  };
  
  const handleDelete = async (linkId: string) => {
    toast({ variant: 'destructive', title: 'Delete Action (Demo)', description: 'This action is disabled in the static UI demo.' });
  }

  const onFormSubmit = async (values: Omit<SocialLink, 'id'>, id?: string) => {
    toast({ title: 'Saved (Demo)', description: 'Social link changes would be saved in a real application.' });
    setOpen(false);
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
            <SocialLinksTable links={links} onEdit={handleEdit} onDelete={handleDelete} />
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
