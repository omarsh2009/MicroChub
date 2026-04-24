'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { LegalAgreement } from '@/lib/types';
import { FileText } from 'lucide-react';

const ACCEPTED_FILE_TYPES = ["application/pdf"];

export function LegalClientPage({ agreement: initialAgreement }: { agreement: LegalAgreement | null}) {
  const { toast } = useToast();
  const [agreement, setAgreement] = useState<LegalAgreement | null>(initialAgreement);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Only PDF files are allowed.' });
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      toast({ variant: 'destructive', title: 'No file selected' });
      return;
    }
    toast({ title: 'Saved (Demo)', description: 'Legal agreement would be updated in a real application.' });
    setAgreement({
        fileName: selectedFile.name,
        fileContent: 'demo-content',
        uploadedAt: new Date().toISOString(),
    });
    setSelectedFile(null);
    setPreview(null);
  };


  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Legal Agreement</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Global Restricted Item Agreement</CardTitle>
          <CardDescription>
            Manage the global legal agreement that users must sign for restricted products.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Current Agreement</CardTitle>
                </CardHeader>
                <CardContent>
                    {agreement ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-muted-foreground" />
                                <span>{agreement.fileName}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Uploaded on {new Date(agreement.uploadedAt).toLocaleDateString()}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No global agreement has been uploaded yet.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle className="text-base">Upload New Agreement</CardTitle>
                    <CardDescription>Uploading a new file will replace the existing one.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input id="legal-file" type="file" accept="application/pdf" onChange={handleFileChange} />
                    </div>
                    {preview && selectedFile && (
                        <div className="p-4 border rounded-md">
                           <p className="text-sm font-medium">Preview: {selectedFile.name}</p>
                           <p className="text-xs text-muted-foreground">This will replace the current agreement.</p>
                        </div>
                    )}
                    <Button onClick={handleSave} disabled={!selectedFile}>
                        Save and Publish New Agreement
                    </Button>
                </CardContent>
            </Card>
        </CardContent>
      </Card>
    </>
  );
}
