import Map from "@/components/Map"
import Menubar from "@/components/Menubar"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function MapPage() {
  const session = await auth();

  if (!session || !session.user?.email) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="h-screen relative">
      <Menubar />
      <Map fetchedNodes={[]} fetchedEdges={[]} />
    </div>
  )
}