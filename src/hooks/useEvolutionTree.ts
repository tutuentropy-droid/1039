import { useMemo, useState, useCallback } from 'react';
import { School } from '@/types';
import { useAppStore } from '@/store';
import { dataService } from '@/services/dataService';

interface TreeNode {
  id: string;
  data: School;
  x: number;
  y: number;
  children: TreeNode[];
}

export const useEvolutionTree = () => {
  const { selectedPeriod, searchTerm, selectedSchool, setSelectedSchool } = useAppStore();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const filteredSchools = useMemo(() => {
    return dataService.getFilteredSchools(selectedPeriod, searchTerm);
  }, [selectedPeriod, searchTerm]);

  const treeData = useMemo(() => {
    const mainSchools = filteredSchools.filter(s => !s.parentId);
    const buildTree = (schools: School[]): TreeNode[] => {
      return schools.map(school => {
        const children = filteredSchools.filter(s => s.parentId === school.id);
        return {
          id: school.id,
          data: school,
          x: school.positionX,
          y: school.positionY,
          children: buildTree(children),
        };
      });
    };
    return buildTree(mainSchools);
  }, [filteredSchools]);

  const allNodes = useMemo(() => {
    const nodes: TreeNode[] = [];
    const traverse = (treeNodes: TreeNode[]) => {
      treeNodes.forEach(node => {
        nodes.push(node);
        if (node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(treeData);
    return nodes;
  }, [treeData]);

  const links = useMemo(() => {
    const linkList: { source: TreeNode; target: TreeNode }[] = [];
    const traverse = (treeNodes: TreeNode[]) => {
      treeNodes.forEach(node => {
        node.children.forEach(child => {
          linkList.push({ source: node, target: child });
        });
        if (node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(treeData);
    return linkList;
  }, [treeData]);

  const handleNodeClick = useCallback((school: School) => {
    if (selectedSchool?.id === school.id) {
      setSelectedSchool(null);
    } else {
      setSelectedSchool(school);
    }
  }, [selectedSchool, setSelectedSchool]);

  const handleNodeHover = useCallback((nodeId: string | null) => {
    setHoveredNode(nodeId);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(z => Math.min(z + 0.1, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(z => Math.max(z - 0.1, 0.5));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handlePan = useCallback((deltaX: number, deltaY: number) => {
    setPan(p => ({ x: p.x + deltaX, y: p.y + deltaY }));
  }, []);

  return {
    treeData,
    allNodes,
    links,
    filteredSchools,
    selectedSchool,
    hoveredNode,
    zoom,
    pan,
    handleNodeClick,
    handleNodeHover,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    handlePan,
  };
};
