'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getLegalAgreement, saveLegalAgreement } from '@/lib/legal';
import type { LegalAgreement } from '@/lib/types';
import { Loader2, UploadCloud, FileText } from 'lucide-react';

const ACCEPTED_FILE_TYPES = ["application/pdf"];

export function LegalClientPage() {
  const { toast } = useToast();
  const [agreement, setAgreement] = useState<LegalAgreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    getLegalAgreement().then(setAgreement).finally(() => setLoading(false));
  }, []);

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
    
    setIsSaving(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64Content = reader.result as string;
        const newAgreement: LegalAgreement = {
          fileName: selectedFile.name,
          fileContent: base64Content,
          uploadedAt: new Date().toISOString(),
        };
        await saveLegalAgreement(newAgreement);
        setAgreement(newAgreement);
        toast({ title: 'Legal Agreement Updated' });
        setSelectedFile(null);
        setPreview(null);
      };
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to save agreement' });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
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
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : agreement ? (
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
                    <Button onClick={handleSave} disabled={isSaving || !selectedFile}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save and Publish New Agreement
                    </Button>
                </CardContent>
            </Card>
        </CardContent>
      </Card>
    </>
  );
}
