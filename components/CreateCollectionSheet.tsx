import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { useForm } from 'react-hook-form';
import { createCollectionSchema, createCollectionSchemaType } from '@/schema/createCollection';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import {zodResolver} from '@hookform/resolvers/zod';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from './ui/select';
import { CollectionColor, CollectionColors } from '@/lib/constant';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { createCollection } from '@/actions/collection';
import { toast } from './ui/use-toast';
import { ReloadIcon } from '@radix-ui/react-icons';
import {useRouter} from 'next/navigation'; 

interface Props{
    open : boolean,
    onOpenChange : (open : boolean) => void;
}

const CreateCollectionSheet = ({open,onOpenChange} : Props) => {

    const form = useForm<createCollectionSchemaType>({
        resolver : zodResolver(createCollectionSchema),
        defaultValues : {},
    });

    const router = useRouter();

    const submitHandler = async(data : createCollectionSchemaType) => {
        try{
            await createCollection(data);
            openChangeWrapper(false);
            router.refresh();
            toast({
                title : "Success",
                description : "Collection created successfully",
            });
        }
        catch(error : any){
            toast({
                title : "Error",
                description : "Something went wrong. Please try again later",
                variant : "destructive",
            });
            console.log("Error while  creating collection", error);
        }
    };

    const openChangeWrapper = (open : boolean) => {
        form.reset();
        onOpenChange(open);
    }

    return (
        <div>
            <Sheet 
                open={open} 
                onOpenChange={openChangeWrapper}
            >
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>
                            Add new collection
                        </SheetTitle>
                        <SheetDescription>
                            Collections are a way to group your tasks.
                        </SheetDescription>
                    </SheetHeader>
                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(submitHandler)} 
                            className='flex flex-col space-y-4'
                            >
                            <FormField 
                                    control={form.control}
                                    name='name'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder='Personal' 
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Collection name
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField 
                                    control={form.control}
                                    name='color'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                Color
                                            </FormLabel>
                                            <FormControl>
                                                <Select 
                                                    onValueChange={(color) => field.onChange(color)}
                                                >
                                                    <SelectTrigger 
                                                        className={cn("w-full h-8 text-white", 
                                                                    CollectionColors[field.value as CollectionColor])}
                                                    >
                                                        <SelectValue
                                                            placeholder="Color"
                                                            className='w-full h-8'
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent 
                                                        className='w-full'>
                                                        {Object.keys(CollectionColors).map((color) => (
                                                            <SelectItem key={color} value={color}
                                                                className={cn(`w-full h-8 rounded-md my-1 text-white focus:text-white 
                                                                                focus:font-bold focus:ring-2 ring-neutral-600 focus:ring-inset
                                                                                dark:focus:ring-white focus:px-8`,
                                                                                CollectionColors[color as CollectionColor]       
                                                                        )}     
                                                            >
                                                                {color}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormDescription>
                                                Select a color of your collection
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                        </form> 
                    </Form>
                    <div 
                        className='flex flex-col mt-4 gap-3'>
                        <Separator />
                        <Button 
                            onClick={form.handleSubmit(submitHandler)}
                            disabled={form.formState.isSubmitting}
                            variant={'outline'}
                            className={cn(
                                form.watch('color') && 
                                    CollectionColors[form.getValues("color") as CollectionColor]
                            )}
                            >
                                Confirm
                                {
                                    form.formState.isSubmitting &&
                                    <ReloadIcon className='ml-2 h-4 w-4 animate-spin' />
                                }
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default CreateCollectionSheet;
