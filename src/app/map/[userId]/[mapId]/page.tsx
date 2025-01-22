import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Map from '@/components/Map';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getEdgesByMapId, getNodesByMapId, getMap } from '@/app/actions/map';
import Menubar from '@/components/Menubar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MapPage({ params }: { params: { userId: string, mapId: string } }) {
  const session = await auth();
  const mapId = params.mapId;

  if (!session || !session.user?.email) {
    redirect('/api/auth/signin');
  }

  try {
    // Get map data
    const map = await getMap(session.user.email, mapId);

    if (!map) {
      return <div>Map not found</div>;
    }

    const nodes = await getNodesByMapId(mapId);
    const edges = await getEdgesByMapId(mapId);

    return (
      <div className="h-screen relative">
        <Menubar mapname={map.title} mapId={params.mapId} />
        <Map mapId={mapId} mapname={map.title} fetchedNodes={nodes} fetchedEdges={edges} />
      </div>
    )
  } catch (error) {
    console.error('Error loading map:', error);
    return <div>Error loading map</div>;
  }
}

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
