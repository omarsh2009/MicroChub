'use client';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { FaqItem } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface FaqTableProps {
  faqs: FaqItem[];
  onEdit: (faq: FaqItem) => void;
  onDelete: (faqId: string) => void;
}

export function FaqTable({ faqs, onEdit, onDelete }: FaqTableProps) {

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40%]">Question</TableHead>
          <TableHead className="w-[40%]">Answer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {faqs.map((faq) => (
          <TableRow key={faq.id}>
            <TableCell className="font-medium">{faq.question}</TableCell>
            <TableCell className="text-muted-foreground truncate max-w-sm">{faq.answer}</TableCell>
             <TableCell>
              <Badge variant={faq.isPublished ? "default" : "outline"}>
                {faq.isPublished ? "Published" : "Hidden"}
              </Badge>
            </TableCell>
            <TableCell>
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(faq)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this FAQ.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(faq.id)} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete it
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
