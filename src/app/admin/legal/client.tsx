'use client';
import { useState } from 'react';
import { PlusCircle, ShieldAlert, FileUp } from 'lucide-react';
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
import { PolicyTable } from './components/policy-table';
import { PolicyForm } from './components/policy-form';
import { useAppContext } from '@/context/app-provider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function PolicyClientPage({ policies: initialPolicies }: { policies: PolicySection[]}) {
  const { toast } = useToast();
  const { policies, setPolicies, contactInfo, setContactInfo } = useAppContext();
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
    setPolicies(policies.filter(p => p.id !== policyId));
    toast({ title: 'Policy Deleted' });
  }

  const onFormSubmit = async (values: Omit<PolicySection, 'id'>, id?: string) => {
    if (id) {
        setPolicies(policies.map(p => p.id === id ? { ...p, ...values } : p));
    } else {
        const newPolicy: PolicySection = {
            id: `policy-${Date.now()}`,
            ...values,
        };
        setPolicies([...policies, newPolicy]);
    }
    toast({ title: 'Policy Saved' });
    setOpen(false);
  };

  const handleAgreementUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          // In a real app we'd upload to Storage. For now, simulate.
          setContactInfo({ ...contactInfo, agreementTemplateUrl: `/files/${file.name}` });
          toast({ title: 'Agreement Template Updated', description: `Template set to ${file.name}` });
      }
  }

  return (
    <div className="space-y-8">
       <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Our Policy</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Policy Section
            </Button>
          </div>
        </div>

      <Card className="border-destructive">
          <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                  <ShieldAlert className="w-5 h-5" />
                  Restricted Items Agreement
              </CardTitle>
              <CardDescription>Upload the PDF template that users must download and sign for restricted products.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="grid gap-2">
                  <Label htmlFor="agreement-template">Agreement Template (PDF)</Label>
                  <div className="flex gap-4 items-center">
                      <Input id="agreement-template" type="file" accept=".pdf" onChange={handleAgreementUpload} className="max-w-sm" />
                      {contactInfo.agreementTemplateUrl && (
                          <span className="text-sm text-muted-foreground italic">Current: {contactInfo.agreementTemplateUrl.split('/').pop()}</span>
                      )}
                  </div>
              </div>
          </CardContent>
      </Card>
      
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
    </div>
  );
}
