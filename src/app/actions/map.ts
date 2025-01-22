"use server"
import { Content, Edge, Map, Node } from "@prisma/client";
import prisma from "../db";

// Create a new node
export const createNode = async (node: Node) => {
    const newnode = await prisma.node.create({
        data: {
        id: node.id,
        type: node.type,
        position: node.position || { x: 0, y: 0 },
        data: node.data || {},
        mapId: node.mapId,
        }
    })
    return newnode;
}

// Create a new edge
export const createEdge = async (edge: Edge) => {
    const newedge = await prisma.edge.create({
        data: edge
    });
    return newedge;
}

// Create a new map
export const createMap = async (map: { name: string, email: string, imageUrl: string }) => {
  const newMap = await prisma.map.create({
    data: {
      title: map.name, // Use name as title
      email: map.email,
      imageUrl: map.imageUrl,
      description: '' // Add empty description since it's optional
    }
  });
  return newMap.id;
};

// Create a new content
export const createContent = async(content: Content) => {
    
    const newcontent = await prisma.content.create({
        data: content
    })
    return newcontent;
}

// Get a content by email
export const getAllContent = async (email: string) => {
    const contents = await prisma.content.findMany({
        where: {
            email: email
        },
        select: {
            id: true,
            name: true,
            type: true,
            content: true
        }
    });
    return contents;
}

// Get a specific map
export const getMap = async (email: string, mapId: string) => {
  const map = await prisma.map.findFirst({
    where: {
      id: mapId,
      email: email,
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return map;
};

// Get all maps by email
export const getAllMaps = async (email: string) => {
    const maps = await prisma.map.findMany({
        where: {
            OR: [
                {
                    email: email // Maps owned by the user
                },
                {
                    collaborators: {
                        some: {
                            user: {
                                email: email
                            }
                        }
                    }
                }
            ]
        }
    });
    return maps;
}  

// Get all nodes by mapId
export const getNodesByMapId = async (mapId: string) => {
    const nodes = await prisma.node.findMany({
        where: {
            mapId: mapId,
        },
    });

    // Remove mapId from each node
    const nodesWithoutMapId = nodes.map(({ mapId, ...rest }) => rest);

    return nodesWithoutMapId;
};


// Get all edges by mapId
export const getEdgesByMapId = async (mapId: string) => {
    const edges = await prisma.edge.findMany({
        where: {
            mapId: mapId
        }
    });

     const edgesWithAnimation = edges.map(({ mapId, ...rest }) => ({
        ...rest,
        animated: true,
    }));

    return edgesWithAnimation;
}
// Get map name by mapId
export const getMapName = async (mapId: string) => {
    const map = await prisma.map.findFirst({
        where: {
            id: mapId
        }
    });
    return map?.name;
}

//  Delete map by mapId
export const deleteMap = async (mapId: string) => {
    const map = await prisma.map.delete({
        where: {
            id: mapId
        }
    });
    return map;
}

// Update map with any data
export const updateMap = async (mapId: string, data: Partial<Map>) => {
  try {
    const updatedMap = await prisma.map.update({
      where: { id: mapId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
    return updatedMap;
  } catch (error) {
    console.error('Error updating map:', error);
    throw error;
  }
};

// Delete nodes and edges by map ID
export const deleteNodesAndEdgesByMapId = async(mapId: string) => {
  await prisma.node.deleteMany({
    where: {
      mapId: mapId
    }
  });
  await prisma.edge.deleteMany({
    where: {
      mapId: mapId
    }
  });
};

// Update map nodes and edges
export const handleUpdate = async ({mapId, nodes, edges, title, imageUrl}: {mapId: string, nodes: any, edges: any, title: string, imageUrl: string}) => {
  // First update the map title and image
  await updateMap(mapId, { title, imageUrl });

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
};
