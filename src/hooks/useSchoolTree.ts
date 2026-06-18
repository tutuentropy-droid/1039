import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { School, Philosopher, Relation, RELATION_TYPE_COLORS, RelationType } from '@/types';
import { dataService } from '@/services/dataService';

export interface TreeGraphNode {
  id: string;
  type: 'school' | 'philosopher';
  name: string;
  data: School | Philosopher;
  color: string;
  schoolId?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface TreeGraphLink {
  source: string | TreeGraphNode;
  target: string | TreeGraphNode;
  relation: Relation;
  color: string;
  relationType: RelationType;
  strength: number;
}

export interface UseSchoolTreeOptions {
  selectedSchoolId?: string | null;
  enabledRelationTypes?: RelationType[];
}

export const useSchoolTree = (options: UseSchoolTreeOptions = {}) => {
  const { selectedSchoolId = null, enabledRelationTypes } = options;

  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [displayNodeId, setDisplayNodeId] = useState<string | null>(null);

  const hoveredNodeIdRef = useRef<string | null>(null);
  const selectedNodeIdRef = useRef<string | null>(null);
  const handleNodeClickRef = useRef<(nodeId: string) => void>(() => {});

  useEffect(() => {
    hoveredNodeIdRef.current = hoveredNodeId;
  }, [hoveredNodeId]);

  useEffect(() => {
    selectedNodeIdRef.current = selectedNodeId;
    setDisplayNodeId(selectedNodeId || hoveredNodeId);
  }, [selectedNodeId, hoveredNodeId]);

  const enabledRelationTypesKey = useMemo(() => {
    return enabledRelationTypes ? enabledRelationTypes.slice().sort().join(',') : '';
  }, [enabledRelationTypes]);

  const graphData = useMemo(() => {
    const allSchools = dataService.getAllSchools();
    const allPhilosophers = dataService.getAllPhilosophers();
    const allRelations = dataService.getAllRelations();

    let schools = allSchools;
    let philosophers = allPhilosophers;

    if (selectedSchoolId) {
      schools = allSchools.filter(s => s.id === selectedSchoolId);
      philosophers = allPhilosophers.filter(p => p.schoolId === selectedSchoolId);
    }

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const nodes: TreeGraphNode[] = [
      ...schools.map((s, i) => ({
        id: s.id,
        type: 'school' as const,
        name: s.name,
        data: s,
        color: s.color,
        schoolId: s.id,
        x: centerX + Math.cos((i / schools.length) * Math.PI * 2) * 80,
        y: centerY + Math.sin((i / schools.length) * Math.PI * 2) * 80,
      })),
      ...philosophers.map((p, i) => {
        const school = allSchools.find(s => s.id === p.schoolId);
        const angle = (i / Math.max(philosophers.length, 1)) * Math.PI * 2;
        return {
          id: p.id,
          type: 'philosopher' as const,
          name: p.name,
          data: p,
          color: school?.color || '#666',
          schoolId: p.schoolId,
          x: centerX + Math.cos(angle) * 200,
          y: centerY + Math.sin(angle) * 200,
        };
      }),
    ];

    const nodeIds = new Set(nodes.map(n => n.id));
    const enabledSet = enabledRelationTypes ? new Set(enabledRelationTypes) : null;
    const filteredRelations = allRelations.filter(r => {
      if (!nodeIds.has(r.sourceId) || !nodeIds.has(r.targetId)) return false;
      if (enabledSet && enabledSet.size > 0) {
        return enabledSet.has(r.relationType);
      }
      return true;
    });

    const links: TreeGraphLink[] = filteredRelations.map(r => ({
      source: r.sourceId,
      target: r.targetId,
      relation: r,
      color: RELATION_TYPE_COLORS[r.relationType],
      relationType: r.relationType,
      strength: r.strength,
    }));

    return { nodes, links };
  }, [selectedSchoolId, enabledRelationTypesKey, dimensions.width, dimensions.height]);

  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;

    const width = dimensions.width;
    const height = dimensions.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const defs = svg.append('defs');

    const container = svg.append('g');

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        setZoom(event.transform.k);
        setPan({ x: event.transform.x, y: event.transform.y });
      });

    svg.call(zoomBehavior).on('dblclick.zoom', null);

    const linkGroup = container.append('g').attr('class', 'links');

    const nodeGroup = container.append('g').attr('class', 'nodes');

    const linkElements = linkGroup.selectAll('path')
      .data(graphData.links)
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', d => 1.5 + d.strength * 0.25)
      .attr('stroke-opacity', 0.7)
      .attr('stroke-dasharray', d => {
        if (d.relationType === 'criticize' || d.relationType === 'opposition') return '8,4';
        if (d.relationType === 'borrow') return '4,3';
        return null as any;
      });

    linkElements.each(function (d: any) {
      const isCriticize = d.relationType === 'criticize' || d.relationType === 'opposition';
      const isBorrow = d.relationType === 'borrow';
      if (isCriticize || isBorrow || d.relationType === 'teacher-student' || d.relationType === 'inheritance') {
        const markerId = `arrow-${d.relation.id}`;
        defs.append('marker')
          .attr('id', markerId)
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 25)
          .attr('refY', 0)
          .attr('markerWidth', 6)
          .attr('markerHeight', 6)
          .attr('orient', 'auto')
          .append('path')
          .attr('d', 'M0,-5L10,0L0,5')
          .attr('fill', d.color);
        d3.select(this).attr('marker-end', `url(#${markerId})`);
      }
    });

    const nodeElements = nodeGroup.selectAll('g')
      .data(graphData.nodes, (d: any) => d.id)
      .enter()
      .append('g')
      .attr('cursor', 'grab')
      .call(d3.drag<SVGGElement, TreeGraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    nodeElements.append('circle')
      .attr('class', 'node-bg')
      .attr('r', d => d.type === 'school' ? 32 : 26)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2.5);

    nodeElements.append('circle')
      .attr('r', d => d.type === 'school' ? 20 : 16)
      .attr('fill', 'rgba(255,255,255,0.18)')
      .attr('cy', d => d.type === 'school' ? -6 : -5)
      .attr('pointer-events', 'none');

    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'school' ? 5 : 4)
      .attr('font-size', d => d.type === 'school' ? '16px' : '13px')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none')
      .text(d => d.type === 'school' ? '派' : d.name.charAt(0));

    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'school' ? 54 : 46)
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('fill', '#2C2416')
      .attr('pointer-events', 'none')
      .text(d => d.name);

    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'school' ? 70 : 62)
      .attr('font-size', '10px')
      .attr('fill', '#8B7355')
      .attr('pointer-events', 'none')
      .text(d => d.type === 'school' ? '流派' : (d.data as Philosopher).dynasty);

    const updateNodeStyles = () => {
      const hId = hoveredNodeIdRef.current;
      const sId = selectedNodeIdRef.current;
      const activeId = sId || hId;

      nodeElements.select('circle.node-bg')
        .attr('stroke', d => (d.id === hId || d.id === sId) ? '#2C2416' : '#fff')
        .attr('stroke-width', d => (d.id === hId || d.id === sId) ? 3.5 : 2.5)
        .attr('opacity', d => {
          if (!activeId) return 1;
          if (d.id === activeId) return 1;

          const isConnected = graphData.links.some(l => {
            const sId2 = typeof l.source === 'string' ? l.source : (l.source as TreeGraphNode).id;
            const tId2 = typeof l.target === 'string' ? l.target : (l.target as TreeGraphNode).id;
            return (sId2 === activeId && tId2 === d.id) || (tId2 === activeId && sId2 === d.id);
          });
          return isConnected ? 0.85 : 0.25;
        });

      linkElements.attr('stroke-opacity', d => {
        if (!activeId) return 0.7;
        const sId2 = typeof d.source === 'string' ? d.source : (d.source as TreeGraphNode).id;
        const tId2 = typeof d.target === 'string' ? d.target : (d.target as TreeGraphNode).id;
        if (sId2 === activeId || tId2 === activeId) return 1;
        return 0.1;
      });
    };

    nodeElements
      .on('mouseover', function (event, d) {
        setHoveredNodeId(d.id);
        d3.select(this).select('circle.node-bg')
          .transition()
          .duration(200)
          .attr('r', d.type === 'school' ? 38 : 32);
        d3.select(this).raise();
        updateNodeStyles();
      })
      .on('mouseout', function (event, d) {
        setHoveredNodeId(null);
        d3.select(this).select('circle.node-bg')
          .transition()
          .duration(200)
          .attr('r', d.type === 'school' ? 32 : 26);
        updateNodeStyles();
      })
      .on('click', function (event, d) {
        event.stopPropagation();
        handleNodeClickRef.current(d.id);
        updateNodeStyles();
      });

    svg.on('click', () => {
      if (selectedNodeIdRef.current) {
        setSelectedNodeId(null);
        updateNodeStyles();
      }
    });

    const simulation = d3.forceSimulation<TreeGraphNode>(graphData.nodes)
      .force('link', d3.forceLink<TreeGraphNode, TreeGraphLink>(graphData.links)
        .id((d: TreeGraphNode) => d.id)
        .distance((d: TreeGraphLink) => {
          if (d.relationType === 'teacher-student') return 100;
          if (d.relationType === 'inheritance') return 110;
          if (d.relationType === 'borrow') return 160;
          if (d.relationType === 'influence') return 150;
          if (d.relationType === 'criticize') return 180;
          if (d.relationType === 'opposition') return 170;
          return 140 - d.strength * 3;
        })
        .strength((d: TreeGraphLink) => {
          if (d.relationType === 'teacher-student') return 0.6;
          if (d.relationType === 'inheritance') return 0.5;
          return 0.2 + d.strength * 0.03;
        }))
      .force('charge', d3.forceManyBody().strength(-450).distanceMax(450))
      .force('x', d3.forceX(centerX).strength(0.08))
      .force('y', d3.forceY(centerY).strength(0.08))
      .force('collision', d3.forceCollide().radius(55))
      .alphaDecay(0.05)
      .velocityDecay(0.4);

    simulation.on('tick', () => {
      linkElements.attr('d', (d: any) => {
        const source = d.source as TreeGraphNode;
        const target = d.target as TreeGraphNode;
        if (source.x == null || source.y == null || target.x == null || target.y == null) return '';

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return `M ${source.x} ${source.y} L ${target.x} ${target.y}`;

        const offset = d.relationType === 'criticize' || d.relationType === 'opposition' || d.relationType === 'borrow' ? 30 : 15;
        const nx = -dy / dist * offset;
        const ny = dx / dist * offset;
        const midX = (source.x + target.x) / 2 + nx;
        const midY = (source.y + target.y) / 2 + ny;

        return `M ${source.x} ${source.y} Q ${midX} ${midY} ${target.x} ${target.y}`;
      });

      nodeElements.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, TreeGraphNode, TreeGraphNode>, d: TreeGraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      d3.select(this).attr('cursor', 'grabbing');
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, TreeGraphNode, TreeGraphNode>, d: TreeGraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, TreeGraphNode, TreeGraphNode>, d: TreeGraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      d3.select(this).attr('cursor', 'grab');
    }

    return () => {
      simulation.stop();
    };
  }, [graphData, dimensions.width, dimensions.height]);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId(prev => prev === nodeId ? null : nodeId);
  }, []);

  useEffect(() => {
    handleNodeClickRef.current = handleNodeClick;
  }, [handleNodeClick]);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNodeId(null);
    setHoveredNodeId(null);
  }, []);

  const handleZoomIn = useCallback(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.3, 3]);
    svg.transition().duration(300).call(zoomBehavior.scaleBy as any, 1.2);
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.3, 3]);
    svg.transition().duration(300).call(zoomBehavior.scaleBy as any, 0.8);
  }, []);

  const handleResetView = useCallback(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.3, 3]);
    svg.transition().duration(500).call(zoomBehavior.transform as any, d3.zoomIdentity);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const selectedNodeData = useMemo(() => {
    if (!selectedNodeId) return null;
    return graphData.nodes.find(n => n.id === selectedNodeId) || null;
  }, [selectedNodeId, graphData.nodes]);

  const hoveredNodeData = useMemo(() => {
    if (!hoveredNodeId) return null;
    return graphData.nodes.find(n => n.id === hoveredNodeId) || null;
  }, [hoveredNodeId, graphData.nodes]);

  const displayNodeData = useMemo(() => {
    return selectedNodeData || hoveredNodeData || null;
  }, [selectedNodeData, hoveredNodeData]);

  return {
    svgRef,
    dimensions,
    setDimensions,
    zoom,
    pan,
    graphData,
    selectedNodeData,
    hoveredNodeData,
    displayNodeData,
    selectedNodeId,
    hoveredNodeId,
    displayNodeId,
    handleNodeClick,
    handleBackgroundClick,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    setSelectedNodeId,
  };
};
