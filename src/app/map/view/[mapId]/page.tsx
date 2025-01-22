"use client"

import React, { useState, useEffect } from 'react'
import MapComponent from '@/components/Map'
import { getMapName, getNodesByMapId, getEdgesByMapId } from '@/app/actions/map';

const MapPage = ({ params }: { params: { mapId: string } }) => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [mapName, setMapName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nodesData, edgesData, mapData] = await Promise.all([
          getNodesByMapId(params.mapId),
          getEdgesByMapId(params.mapId),
          getMapName(params.mapId)
        ])
        setNodes(nodesData)
        setEdges(edgesData)
        setMapName(mapData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.mapId])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <MapComponent 
      mapId={params.mapId}
      mapname={mapName}
      fetchedNodes={nodes}
      fetchedEdges={edges}
    />
  )
}

export default MapPage