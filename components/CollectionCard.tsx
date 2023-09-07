"use client";
import { Collection, task } from '@prisma/client';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
import { useMemo, useState, useTransition } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { CollectionColor, CollectionColors } from '@/lib/constant';
import { CaretDownIcon, CaretUpIcon, TrashIcon } from '@radix-ui/react-icons';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import PlusIcon from './icons/PlusIcon';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { AlertDescription } from './ui/alert';
import {useRouter} from 'next/navigation'; 
import { deleteCollection } from '@/actions/collection';
import { toast } from './ui/use-toast';
import CreateTaskDialog from './CreateTaskDialog';
import TaskCard from './TaskCard';
interface Props { collection : Collection & {
        task : task[];
    }
};

const CollectionCard = ({collection} : Props) => {
    const [isOpen, setIsOpen] = useState(true); 
    const [isLoading, startTransition] = useTransition();
    const router = useRouter();
    const tasks = collection.task;
    const [showCreateModel, setShowCreateModel] = useState(false);
    const totalTask = collection.task.length;

    const taskDone = useMemo(() => {
        return collection.task.filter((t) => t.done).length;
    }, [collection.task])

    const progress = totalTask == 0 ? 0 : (taskDone / totalTask)*100;

    const removeCollection = async() => {
        try{
            await deleteCollection(collection.id);
            router.refresh();
            toast({
                title : "Success",
                description : "Collection deleted successfully",
            })
        }
        catch(error){
            toast({
                title : "Error",
                description : "cannot be delete collection",
                variant : 'destructive',
            })
        }
    }

    return (
        <>
            <CreateTaskDialog
                open={showCreateModel} 
                setOpen={setShowCreateModel}
                collection={collection}
            />
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <Button
                    variant='ghost'
                    className={cn(
                        'w-full flex justify-between p-6',
                        isOpen && 'rounded-b-none',
                        CollectionColors[collection.color as CollectionColor]
                    )}
                    >
                        <span>{collection.name}</span>
                        {!isOpen && <CaretDownIcon className='h-6 w-6'/>}
                        {isOpen && <CaretUpIcon className='h-6 w-6' />}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent 
                    className='flex rounded-b-md flex-col dark:bg-neurtal-900 shadow-lg'>
                    {tasks.length == 0 && 
                        <Button 
                            variant={"ghost"} 
                            className='flex items-center justify-center gap-1 py-12 p-8 rounded-none' 
                            onClick={() => setShowCreateModel(true)}
                        > 
                            <p>There are no task yet: 
                                <span 
                                    className={cn("text-sm bg-clip-text text-transparent", 
                                                CollectionColors[collection.color as CollectionColor])}
                                >
                                    Create one
                                </span>
                            </p>
                        </Button>}
                    {tasks.length > 0 && (
                        <>
                            <Progress 
                                value={progress} 
                                className='rounded-none' 
                            />
                            <div className='gap-3 p-4 flex flex-col'>
                                {
                                    tasks.map((task) => (
                                        <TaskCard 
                                            key={task.id}
                                            task={task}
                                        />
                                    ))
                                }
                            </div>
                        </>
                    )}
                    <Separator />
                    <footer 
                        className='h-[40px] px-4 text-xs text-neutral-500 flex justify-between 
                                    items-center'
                        >
                        <p>
                            Created at {collection.createdAt.toLocaleDateString("en-US")}
                        </p>
                        {
                            isLoading && (<div>Deleting...</div>)
                        }
                        {
                            !isLoading && (
                                <div>
                                    <Button 
                                        size="icon" 
                                        variant='ghost'
                                        onClick={() => setShowCreateModel(true)}
                                    >
                                        <PlusIcon />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button 
                                                size="icon" 
                                                variant='ghost'
                                            >
                                                <TrashIcon />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent> 
                                            <AlertDialogTitle>
                                                Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDescription>
                                                This action cannot be undone. this
                                                will permanently delete your 
                                                collection and all task inside it.
                                            </AlertDescription>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction 
                                                    onClick={() => startTransition(removeCollection)}
                                                >
                                                    Process
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )
                        }
                    </footer>
                </CollapsibleContent>
            </Collapsible>
        </>
    )
}

export default CollectionCard
