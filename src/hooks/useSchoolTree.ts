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
  const handleNodeClickRef = useRef<(nodeId: string) => void>(() => {});

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

    const nodes: TreeGraphNode[] = [
      ...schools.map(s => ({
        id: s.id,
        type: 'school' as const,
        name: s.name,
        data: s,
        color: s.color,
        schoolId: s.id,
      })),
      ...philosophers.map(p => {
        const school = allSchools.find(s => s.id === p.schoolId);
        return {
          id: p.id,
          type: 'philosopher' as const,
          name: p.name,
          data: p,
          color: school?.color || '#666',
          schoolId: p.schoolId,
        };
      }),
    ];

    const nodeIds = new Set(nodes.map(n => n.id));
    const filteredRelations = allRelations.filter(r => {
      if (!nodeIds.has(r.sourceId) || !nodeIds.has(r.targetId)) return false;
      if (enabledRelationTypes && enabledRelationTypes.length > 0) {
        return enabledRelationTypes.includes(r.relationType);
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
  }, [selectedSchoolId, enabledRelationTypes]);

  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;

    const width = dimensions.width;
    const height = dimensions.height;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.append('g');

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        setZoom(event.transform.k);
        setPan({ x: event.transform.x, y: event.transform.y });
      });

    svg.call(zoomBehavior);

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
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(55));

    const linkGroup = container.append('g').attr('class', 'links');

    graphData.links.forEach((linkData) => {
      const isCriticize = linkData.relationType === 'criticize' || linkData.relationType === 'opposition';
      const isBorrow = linkData.relationType === 'borrow';

      const path = linkGroup.append('path')
        .attr('fill', 'none')
        .attr('stroke', linkData.color)
        .attr('stroke-width', () => {
          return 1.5 + linkData.strength * 0.25;
        })
        .attr('stroke-opacity', 0.7);

      if (isCriticize) {
        path.attr('stroke-dasharray', '8,4');
      } else if (isBorrow) {
        path.attr('stroke-dasharray', '4,3');
      }

      if (isCriticize || isBorrow || linkData.relationType === 'teacher-student' || linkData.relationType === 'inheritance') {
        const markerId = `arrow-${linkData.relation.id}`;
        const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');
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
          .attr('fill', linkData.color);

        path.attr('marker-end', `url(#${markerId})`);
      }
    });

    const link = linkGroup.selectAll('path');

    const node = container.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('cursor', 'grab')
      .call(d3.drag<SVGGElement, TreeGraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', d => d.type === 'school' ? 32 : 26)
      .attr('fill', d => d.color)
      .attr('stroke', d => {
        if (hoveredNodeId === d.id || selectedNodeId === d.id) return '#2C2416';
        return '#fff';
      })
      .attr('stroke-width', d => (hoveredNodeId === d.id || selectedNodeId === d.id) ? 3.5 : 2.5)
      .attr('opacity', d => {
        if (hoveredNodeId && hoveredNodeId !== d.id) return 0.45;
        if (selectedNodeId && selectedNodeId !== d.id) return 0.45;
        return 1;
      });

    node.append('circle')
      .attr('r', d => d.type === 'school' ? 20 : 16)
      .attr('fill', 'rgba(255,255,255,0.18)')
      .attr('cy', d => d.type === 'school' ? -6 : -5)
      .attr('pointer-events', 'none');

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'school' ? 5 : 4)
      .attr('font-size', d => d.type === 'school' ? '16px' : '13px')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none')
      .text(d => d.type === 'school' ? '派' : d.name.charAt(0));

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'school' ? 54 : 46)
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('fill', '#2C2416')
      .attr('pointer-events', 'none')
      .text(d => d.name);

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'school' ? 70 : 62)
      .attr('font-size', '10px')
      .attr('fill', '#8B7355')
      .attr('pointer-events', 'none')
      .text(d => d.type === 'school' ? '流派' : (d.data as Philosopher).dynasty);

    node.on('mouseover', function(event, d) {
      setHoveredNodeId(d.id);
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', d.type === 'school' ? 38 : 32);

      d3.select(this).raise();
    })
    .on('mouseout', function(event, d) {
      setHoveredNodeId(null);
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', d.type === 'school' ? 32 : 26);
    })
    .on('click', function(event, d) {
      event.stopPropagation();
      handleNodeClickRef.current(d.id);
    });

    simulation.on('tick', () => {
      link.attr('d', (d: any) => {
        const source = d.source as TreeGraphNode;
        const target = d.target as TreeGraphNode;
        if (!source.x || !source.y || !target.x || !target.y) return '';

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return '';

        const offset = d.relationType === 'criticize' || d.relationType === 'opposition' || d.relationType === 'borrow' ? 30 : 15;
        const nx = -dy / dist * offset;
        const ny = dx / dist * offset;
        const midX = (source.x + target.x) / 2 + nx;
        const midY = (source.y + target.y) / 2 + ny;

        return `M ${source.x} ${source.y} Q ${midX} ${midY} ${target.x} ${target.y}`;
      });

      node.attr('transform', d => `translate(${d.x},${d.y})`);
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
  }, [graphData, dimensions, hoveredNodeId, selectedNodeId]);

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
    svg.transition().duration(300).call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      1.2
    );
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      0.8
    );
  }, []);

  const handleResetView = useCallback(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    );
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

  return {
    svgRef,
    dimensions,
    setDimensions,
    zoom,
    pan,
    graphData,
    selectedNodeData,
    hoveredNodeData,
    selectedNodeId,
    hoveredNodeId,
    handleNodeClick,
    handleBackgroundClick,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    setSelectedNodeId,
  };
};
