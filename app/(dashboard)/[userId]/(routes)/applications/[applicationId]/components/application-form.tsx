"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { CalendarIcon, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Application } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import postApplication from "@/actions/post-application";
import patchApplication from "@/actions/patch-application";
import deleteApplication from "@/actions/delete-application";

const BACKEND_URL = process.env.BACKEND_URL || "";
const validStatusValues = ['To Apply', 'Applied', 'Rejected', 'Interview', 'Offered', 'Accepted Offer'];

const formSchema = z.object({
  company: z.string().min(2),
  position: z.string().min(2),
  status: z.string().min(2).refine((value) => validStatusValues.includes(value), {
    message: 'Invalid status value. Allowed values are: To Apply, Applied, Rejected, Interview, Accepted Offer, Offered',
  }),
  location: z.string().min(2),
  salary: z.string().optional(),
  dateApplied: z.date({
    required_error: 'Date Applied is required.',
  }),
  links: z.string().optional(),
  notes: z.string().optional(),
});


type ApplicationFormValues = z.infer<typeof formSchema>

interface ApplicationFormProps {
  initialData: Application | null;
};

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit application' : 'Create application';
  const description = initialData ? 'Edit application.' : 'Add new application';
  const toastMessage = initialData ? 'Application updated.' : 'Application created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: initialData?.company || '',
      position: initialData?.position || '',
      status: initialData?.status || '',
      location: initialData?.location || '',
      salary: initialData?.salary || '',
      dateApplied: initialData ? new Date(initialData.dateApplied) : new Date(),
      links: initialData?.links ? initialData.links.join(', ') : '', // Join array items with ', '
      notes: initialData?.notes || '',
    }
  });

  const onSubmit = async (data: ApplicationFormValues) => {
    try {
      setLoading(true);
      const requestData = {
        ...data,
        userExternalId: params.userId,
      }
      let response = null;
      if (initialData) {
        response = await patchApplication(requestData, params.applicationId as string)
      } else {
        response = await postApplication(requestData);
      }
      if (response) {
        router.refresh();
        router.push(`/${params.userId}/applications`);
        toast.success(toastMessage);
      }
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteApplication(params.applicationId as string);
      router.refresh();
      router.push(`/${params.userId}/applications`);
      toast.success('Application deleted.');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Position name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Location of position" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Salary (Optional)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select current status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {field.value === '' && (
                        validStatusValues.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))
                      )}
                      {field.value === 'To Apply' && (
                        validStatusValues.map((status) => (
                          status !== 'To Apply' && (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          )
                        ))
                      )}
                      {field.value === 'Applied' && (
                        validStatusValues.map((status) => (
                          status !== 'To Apply' && (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          )
                        ))
                      )}
                      {field.value === 'Interview' && (
                        validStatusValues.map((status) => (
                          status !== 'To Apply' && status !== 'Applied' && (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          )
                        ))
                      )}
                      {field.value === 'Offered' && (
                        validStatusValues.map((status) => (
                          status === 'Offered' || status === 'Rejected' || status === 'Accepted Offer' && (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          )
                        ))
                      )}
                      {field.value === 'Accepted Offer' && (
                        validStatusValues.map((status) => (
                          status === 'Accepted Offer' && (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          )
                        ))
                      )}
                      {field.value === 'Rejected' && (
                        validStatusValues.map((status) => (
                          status !== 'To Apply' && (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          )
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="dateApplied"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Date Applied</FormLabel>
                    <FormDescription>
                        The date you submitted this application.
                    </FormDescription>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                            date > new Date()
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
          </div>
        <FormField
            control={form.control}
            name="links"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Links (Optional)</FormLabel>
                <FormDescription>
                    Links to the job posting, company website, etc.
                </FormDescription>
                <FormControl>
                    <Input disabled={loading} placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormDescription>
                    Any additional notes you want to add.
                </FormDescription>
                <FormControl>
                    <Textarea disabled={loading} placeholder="Notes" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
