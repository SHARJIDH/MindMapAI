'use client'
import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Sidebar from "@/components/Sidebar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { nodeLabelState } from '@/app/store/atoms/nodelabel';
import CustomTitleNode from '@/components/customNode/TitleNode';
import CustomDataNode from '@/components/customNode/DataNode';
import VideoNode from '@/components/customNode/VideoNode';
import TermNode from '@/components/customNode/TermNode';
import ConceptNode from '@/components/customNode/ConceptNode';
import { targetNode } from '@/app/store/atoms/nodelabel';
import { reactNode, reactEdge, relativeParentNodePosition, selectedNode } from '@/app/store/atoms/nodes'
import Menubar from './Menubar';
import { CollaborationDialog } from "./CollaborationDialog";
import { Button } from '@/components/ui/button';

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string, description?: string };
  selected: boolean;
  style: {}
}

interface Edge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
}

interface MapProps {
  mapId?: string;
  mapname?: string;
  fetchedNodes?: Node[];
  fetchedEdges?: Edge[];
}

export default function Map({ mapId, mapname, fetchedNodes, fetchedEdges }: MapProps) {  
  
  const [nodes, setNodes] = useRecoilState<Node[]>(reactNode);
  const [edges, setEdges] = useRecoilState<Edge[]>(reactEdge);
  const [nodeLabel, setNodeLabel] = useRecoilState(nodeLabelState);
  const [targetNodeId, setTargetNodeId] = useRecoilState(targetNode);
  const [parentNodePosition, setParentNodePosition] = useRecoilState(relativeParentNodePosition);
  const [selectedNodeId, setSelectedNodeId] = useRecoilState(selectedNode);
  const [isCollaborationDialogOpen, setIsCollaborationDialogOpen] = useState(false);

  useEffect(() => {
    if (fetchedNodes && fetchedEdges) {
      setNodes(fetchedNodes);
      setEdges(fetchedEdges);
    } else {
      // Initialize with a default node for new maps
      const defaultNode = {
        id: '1',
        type: 'titleNode',
        position: { x: window.innerWidth / 2 - 75, y: window.innerHeight / 2 - 25 },
        data: { label: 'New Mind Map' },
        selected: false,
        style: {}
      };
      setNodes([defaultNode]);
      setEdges([]);
    }
  }, [fetchedNodes, fetchedEdges, setNodes, setEdges]);

  const setSelectedNode = useSetRecoilState(selectedNode);

  const setTargetNode = useSetRecoilState(targetNode);

  const nodeTypes = {
    'titleNode': CustomTitleNode,
    'dataNode': CustomDataNode,
    'videoNode': VideoNode,
    'termNode': TermNode,
    'conceptNode': ConceptNode
  }



  const onConnect = useCallback(
    (connection) =>
      setEdges((eds: Edge[]) => addEdge({ ...connection, animated: true }, eds)),
    [edges],
  );

  const onNodesChange = useCallback(
    
    (changes) => {
      setNodes((nds) => {
        const clonedNodes = structuredClone(nds);
        return applyNodeChanges(changes, clonedNodes);
      });
    },
    [setNodes]
  );
  

  const getNodeData = useCallback(() => {
    const selectedNode = nodes.find((node: Node) => node.selected || false) as Node | undefined;
    setSelectedNode(selectedNode || {});
    console.log(selectedNode)
    setParentNodePosition(selectedNode?.position || { x: 0, y: 0 });

    if (selectedNode?.type === 'dataNode') {
      setNodeLabel(selectedNode.data.description || '');
    } else if (selectedNode?.type === 'termNode') {
      setNodeLabel(selectedNode.data.term || '');
    } else if (selectedNode?.type === 'conceptNode') {
      setNodeLabel(selectedNode.data.term || '');
    }


    else {
      setNodeLabel(selectedNode?.data.label || '');
    }
  }
    , [nodes])


  const getSelectedNode = useCallback(() => {
    const selectedNode = nodes.find((node: Node) => node.selected || false) as Node | undefined;
    if (selectedNode) {
      setTargetNodeId(selectedNode.id);
    }
  } 
  , [nodes])

  const addNewEdge = (source: string, target: string) => {
    const newEdge = {
      id: new Date().getTime().toString(),
      source,
      target,
      animated: true,
    };
    setEdges([...edges, newEdge]);
  }



  useEffect(() => {
    getNodeData();
    getSelectedNode();
  }, [nodes])

  const onEdgesChange = useCallback(
    (changes: any) => {
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    [setEdges],
  );

  const addNewNode = (content: string) => {
    if(!content) {
      toast.error('Please enter a topic name');
      return;
    }
    const newNode = {
      id: new Date().getTime().toString(),
      type: 'titleNode',
      position: { x: 0, y: 0 },
      data: { label: content },
    };
    setNodes([...nodes, newNode]);
    return newNode.position;
  }

  const addDescriptionNode = (title: string, description: string) => {
    const newNode = {
      id: new Date().getTime().toString(),
      type: 'dataNode',
      position: {
        x: parentNodePosition.x + Math.floor(Math.random() * (500 - 300 + 1)) + 300,
        y: parentNodePosition.y + Math.floor(Math.random() * (500 - 300 + 1)) + 300
      },
      data: { title, description, color: "#ffffff" },
    };
    setNodes([...nodes, newNode]);
    return newNode.id;
  }

  const onColorChange = useCallback((nodeId: string, color: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, color, onChange: onColorChange } }
          : node
      )
    );
  }, []);
  

  const [showCollaborationDialog, setShowCollaborationDialog] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100%' }} id="mindmap-container">
      <ReactFlow
        id="react-flow-id"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
      >
        <Panel position="top-right">
          <Sidebar addNewEdge={addNewEdge} addNewNode={addNewNode} addDescriptionNode={addDescriptionNode} />
        </Panel>

        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

      </ReactFlow>
      <ToastContainer />
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCollaborationDialog(true)}
        >
          Share
        </Button>
      </div>
      <CollaborationDialog
        isOpen={showCollaborationDialog}
        onClose={() => setShowCollaborationDialog(false)}
        mapId={mapId}
      />
    </div>
  );
}
