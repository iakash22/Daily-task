import SadFace from '@/components/icons/SadFace';
import CreateCollectionButton from '@/components/CreateCollectionButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import prisma from '@/lib/prisma';
import { wait } from '@/lib/wait';
import {currentUser} from '@clerk/nextjs';
import { Suspense } from 'react';
import CollectionCard from '@/components/CollectionCard';

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMsgFallback />}>
        <WelcomeMsg />
      </Suspense>
      <Suspense fallback={<div>Loding Collections...</div>}><CollectionList /></Suspense>
    </>
  )
};

const WelcomeMsg = async() => {
  const user = await currentUser();
  await wait(2000);

  if(!user) return <div>Error !</div>

  return (
    <div className='flex w-full items-center mb-12'>
      <h1 className='text-4xl font-bold'>
        Welcome,<br /> {user.firstName} {user.lastName}
      </h1>
    </div>
  );
}

const WelcomeMsgFallback = async() => {
  return(
    <div className='flex w-full mb-12'>
      <h1 className='text-4xl font-bold'>
        <Skeleton className='h-[36px] w-[150px]' />
        <Skeleton className='h-[36px] w-[150px]' />
      </h1>
    </div>
  )
};

const CollectionList = async () => {
  const user = await currentUser();
  await wait(3000);

  const collections = await prisma.collection.findMany({
    include : {
      task : true,
    },
    where : {
      userId : user?.id,
    },
  });

  if(collections.length === 0){
    return (
      <div className='flex flex-col gap-5'>
        <Alert>
          <SadFace />
          <AlertTitle>There are no collection yet!</AlertTitle>
          <AlertDescription>Create a collection to get started</AlertDescription>
        </Alert>
        <CreateCollectionButton />
      </div>
    )
  };

  return (
    <>
      <CreateCollectionButton />
      <div className='flex flex-col gap-4 mt-6'>
        {
          collections.map((collection) => (
            <CollectionCard 
              key={collection.id} 
              collection={collection} 
            />
          ))
        }
      </div>
    </>
  )

};