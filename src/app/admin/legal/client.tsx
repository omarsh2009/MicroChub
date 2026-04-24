
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
import type { PolicySection } from '@/lib/types';
import { PolicyTable } from '../social-links/components/social-links-table';
import { PolicyForm } from '../social-links/components/social-link-form';


export function PolicyClientPage({ policies: initialPolicies }: { policies: PolicySection[]}) {
  const { toast } = useToast();
  const [policies, setPolicies] = useState<PolicySection[]>(initialPolicies);
  const [open, setOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicySection | undefined>(undefined);

  const handleAdd = () => {
    setSelectedPolicy(undefined);
    setOpen(true);
  };

  const handleEdit = (policy: PolicySection) => {
    setSelectedPolicy(policy);
    setOpen(true);
  };
  
  const handleDelete = (policyId: string) => {
    toast({
        variant: 'destructive',
        title: 'Delete Action (Demo)',
        description: 'This action is disabled in the static UI demo.',
    });
  }

  const onFormSubmit = async (values: Omit<PolicySection, 'id'>, id?: string) => {
    toast({
        title: 'Saved (Demo)',
        description: 'Policy changes would be saved in a real application.',
    });
    setOpen(false);
  };

  return (
    <>
       <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Our Policy</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Policy Section
            </Button>
          </div>
        </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Policy Sections</CardTitle>
          <CardDescription>Create, edit, and manage sections that appear on your public policy page.</CardDescription>
        </CardHeader>
        <CardContent>
            <PolicyTable policies={policies} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedPolicy ? 'Edit' : 'Add'} Policy Section</DialogTitle>
          </DialogHeader>
          <PolicyForm
            policy={selectedPolicy}
            onSubmit={onFormSubmit}
            onFinished={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
