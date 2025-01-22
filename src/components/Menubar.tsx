"use client"

import { useState } from 'react'
import { FileText, Save, BookType, Newspaper, LibraryBig, PencilLine, Download, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import { reactNode, reactEdge } from '@/app/store/atoms/nodes'
import { createNode, createEdge, deleteNodesAndEdgesByMapId, updateMap } from '@/app/actions/map'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation'
import { captureMap } from '@/lib/capture'
import Link from 'next/link'
import { ContentDialog } from './ContentDialog'
import { prisma } from '@/lib/prisma';

export default function Menubar({ mapname, mapId }: { mapname?: string, mapId?: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isPhraseDialogOpen, setIsPhraseDialogOpen] = useState(false);
  const [mapName, setMapName] = useState(mapname || '');
  const [phraseDialogContent, setPhraseDialogContent] = useState({ information: '' });
  const [contentType, setContentType] = useState('');
  const nodes = useRecoilValue(reactNode);
  const edges = useRecoilValue(reactEdge);

  const extractNodeData = () => {
    let subjectData = ''
    nodes.forEach(node => {
      if (node.type === 'termNode') {
        subjectData += node.data.term + ' '
      } else if (node.type === 'descriptionNode') {
        subjectData += node.data.description + ' '
      } else {
        subjectData += node.data.label
      }
    });
    return subjectData;
  }

  const { mutate: getContent, isPending } = useMutation({
    mutationFn: async ({ subjectData, intent }: { subjectData: string, intent: string }) => {
      if (nodes.length < 1) {
        toast.error('Please add some nodes to the concept map');
        return;
      }
      setIsPhraseDialogOpen(true)
      const response = await axios.post('/api/phrase', { subjectData, intent });
      const data = await response.data;
      setContentType(intent)
      return data;
    },
    onSuccess: (data) => {
      setPhraseDialogContent(data);
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
      setIsPhraseDialogOpen(false);
    }
  })

  const { mutate: handleSave, isPending: isSavePending } = useMutation({
    mutationFn: async () => {
      if (nodes.length < 1) {
        toast.error('Please add some nodes to the concept map');
        return;
      }
      if (!mapName.trim()) {
        toast.error('Please enter a map name');
        return;
      }
      if (!session || !session.user || !session.user.email) {
        toast.error('User session is not available');
        return;
      }

      try {
        // Capture the map as an image
        const imageBuffer = await captureMap('mindmap-container');
        
        // Create form data for the image upload
        const formData = new FormData();
        const fileName = `${session.user.email}/maps/${Date.now()}-${mapName}.png`;
        const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
        formData.append('file', imageBlob, 'map.png');
        formData.append('fileName', fileName);

        // Upload image using the API route
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const { url: imageUrl } = await uploadResponse.json();

        if (mapId) {
          // Update existing map
          await handleUpdate({
            mapId,
            nodes,
            edges,
            title: mapName,
            imageUrl
          });
          toast.success('Map updated successfully!');
        } else {
          // Create new map
          const map = await createMap({ 
            name: mapName, 
            email: session.user.email,
            imageUrl 
          });
          toast.success('Map saved successfully!');
          router.push(`/map/${session?.user?.id}/${map}`);
        }

        setIsSaveDialogOpen(false);
      } catch (error) {
        console.error('Error saving map:', error);
        throw error;
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error('An error occurred while saving the map');
    }
  });

  const { mutate: handleUpdate, isPending: isUpdating } = useMutation({
    mutationFn: async ({mapId, nodes, edges, title, imageUrl}: {mapId: string, nodes: any, edges: any, title: string, imageUrl: string}) => {
      // Delete existing nodes and edges
      await deleteNodesAndEdgesByMapId(mapId);

      // Create new nodes
      const nodePromises = nodes.map((node:any) =>
        createNode({
          data: node.data,
          id: node.id,
          type: node.type,
          mapId: mapId,
          position: node.position,
        })
      );
      await Promise.all(nodePromises);

      // Create new edges
      const edgePromises = edges.map((edge:any) =>
        createEdge({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          mapId: mapId,
        })
      );
      await Promise.all(edgePromises);

      // Update map title and image using server action
      await updateMap(mapId, { title, imageUrl });
    },
    onError: (error) => {
      console.error('Error updating map:', error);
      toast.error('An error occurred while updating the map');
    },
    onSuccess: () => {
      toast.success('Map updated successfully');
    }
  });

  const handleDownload = async () => {
    try {
      if (nodes.length < 1) {
        toast.error('Please add some nodes to the concept map');
        return;
      }

      // Capture the map as an image
      const imageBuffer = await captureMap('mindmap-container');
      
      // Convert buffer to blob
      const blob = new Blob([imageBuffer], { type: 'image/png' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${mapName || 'mindmap'}.png`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Mind map downloaded successfully!');
    } catch (error) {
      console.error('Error downloading map:', error);
      toast.error('Failed to download mind map');
    }
  };

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="absolute top-4 left-4 z-50">
        <Skeleton className="h-8 w-[100px]" />
      </div>
    )
  }

  return (
    <div className="absolute top-4 left-4 z-50">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-white bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-md">
            {mapname === undefined ? "Untitled Map" : mapname}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Save Mind Map</DialogTitle>
                <DialogDescription>
                  {mapId ? "Update your mind map with a new title" : "Give your mind map a title to save it"}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="My new map"
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  className="w-full text-base py-2"
                />
              </div>
              <DialogFooter>
                <Button 
                  disabled={mapName.length < 1 || isSavePending} 
                  className="w-full h-10 text-sm font-semibold" 
                  onClick={() => handleSave()}
                >
                  {isSavePending ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {mapname === undefined ? (
            <Button
              onClick={() => setIsSaveDialogOpen(true)}
              variant="outline"
              size="sm"
              className="shadow-sm bg-white/50 backdrop-blur-sm hover:bg-white/70"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          ) : (
            <Button
              onClick={() => handleUpdate({mapId, nodes, edges, title: mapName, imageUrl: ''})}
              variant="outline"
              size="sm"
              className="shadow-sm bg-white/50 backdrop-blur-sm hover:bg-white/70"
              disabled={isUpdating}
            >
              <PencilLine className="h-4 w-4 mr-2" />
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
          )}

          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="shadow-sm bg-white/50 backdrop-blur-sm hover:bg-white/70"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>

          <Link href="/library">
            <Button
              variant="outline"
              size="sm"
              className="shadow-sm bg-white/50 backdrop-blur-sm hover:bg-white/70"
            >
              <LibraryBig className="h-4 w-4 mr-2" />
              Library
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {[
            { icon: BookType, label: "Essay" },
            { icon: Newspaper, label: "Blog" },
            { icon: FileText, label: "Summary" }
          ].map(({ icon: Icon, label }) => (
            <Button
              onClick={() => getContent({ subjectData: extractNodeData(), intent: label.toUpperCase() })}
              key={label}
              variant="outline"
              size="sm"
              className="shadow-sm bg-white/50 backdrop-blur-sm hover:bg-white/70"
              disabled={nodes.length < 1}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      <ContentDialog
        open={isPhraseDialogOpen}
        onClose={() => setIsPhraseDialogOpen(false)}
        content={phraseDialogContent.information}
        isLoading={isPending}
        contentType={contentType}
      />
    </div>
  )
}
