import React from 'react'
import { auth } from '@/auth';
import Map from '@/components/Map';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getEdgesByMapId, getNodesByMapId, getMap } from '@/app/actions/map';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Viewmap = async ({ params }: { params: { userId: string, mapId: string } }) => {

  const session = await auth();
  const sessionId = session?.user?.id;
  const {userId, mapId} = params;

  if (userId !== sessionId) {
    console.log('Unauthorized')
    return <UnauthorizedPage />
  }

  try {
    const nodes = await getNodesByMapId(mapId);
    const edges = await getEdgesByMapId(mapId);
    const map = await getMap(session?.user?.email, mapId);

    return (
      <>
        <Map mapId={mapId} mapname={map?.name} fetchedNodes={nodes} fetchedEdges={edges} />
      </>
    )
  } catch (error) {
    console.error('Error loading map:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error Loading Map</h1>
        <p className="text-gray-600 mb-4">There was an error loading the map data.</p>
        <Button asChild>
          <Link href="/library">Return to Library</Link>
        </Button>
      </div>
    );
  }
}

export default Viewmap

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-50 to-red-100">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-lg rounded-lg text-center">
        <div className="animate-bounce mb-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          Oops! It seems you don't have permission to access this page. Please log in or contact the administrator for assistance.
        </p>
        <Link href="/" passHref>
          <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
