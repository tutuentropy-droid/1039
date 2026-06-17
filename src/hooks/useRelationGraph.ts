import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { School, Philosopher, Relation, RELATION_TYPE_COLORS } from '@/types';
import { useAppStore } from '@/store';
import { dataService } from '@/services/dataService';

interface GraphNode {
  id: string;
  type: 'school' | 'philosopher';
  name: string;
  data: School | Philosopher;
  color: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  relation: Relation;
  color: string;
  strength: number;
}

export const useRelationGraph = () => {
  const {
    highlightedRelations,
    pathStartId,
    pathEndId,
    currentPath,
    setPathStart,
    setPathEnd,
    calculatePath,
    clearPath,
  } = useAppStore();

  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const graphData = useMemo(() => {
    const schools = dataService.getAllSchools();
    const philosophers = dataService.getAllPhilosophers();
    const relations = dataService.getAllRelations();

    const nodes: GraphNode[] = [
      ...schools.map(s => ({
        id: s.id,
        type: 'school' as const,
        name: s.name,
        data: s,
        color: s.color,
      })),
      ...philosophers.map(p => {
        const school = schools.find(s => s.id === p.schoolId);
        return {
          id: p.id,
          type: 'philosopher' as const,
          name: p.name,
          data: p,
          color: school?.color || '#666',
        };
      }),
    ];

    const links: GraphLink[] = relations.map(r => ({
      source: r.sourceId,
      target: r.targetId,
      relation: r,
      color: RELATION_TYPE_COLORS[r.relationType],
      strength: r.strength,
    }));

    return { nodes, links };
  }, []);

  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;

    const width = dimensions.width;
    const height = dimensions.height;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);

    const simulation = d3.forceSimulation<GraphNode>(graphData.nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(graphData.links)
        .id((d: GraphNode) => d.id)
        .distance((d: GraphLink) => 120 - d.strength * 5)
        .strength((d: GraphLink) => d.strength * 0.1))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(45));

    const link = container.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graphData.links)
      .enter()
      .append('line')
      .attr('stroke', d => highlightedRelations.includes(d.relation.id) ? d.color : '#ccc')
      .attr('stroke-width', d => highlightedRelations.includes(d.relation.id) ? 3 + d.strength * 0.3 : 1 + d.strength * 0.2)
      .attr('stroke-opacity', d => highlightedRelations.length > 0 ? (highlightedRelations.includes(d.relation.id) ? 1 : 0.15) : 0.6);

    const linkLabel = container.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(graphData.links.filter(d => highlightedRelations.includes(d.relation.id)))
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#666')
      .text(d => d.relation.description.substring(0, 20) + '...');

    const node = container.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', d => d.type === 'school' ? 28 : 22)
      .attr('fill', d => {
        if (pathStartId === d.id) return '#10B981';
        if (pathEndId === d.id) return '#F59E0B';
        if (selectedNode === d.id) return d3.color(d.color)?.brighter(0.3) as string;
        return d.color;
      })
      .attr('stroke', d => {
        if (hoveredNode === d.id || selectedNode === d.id) return '#2C2416';
        return '#fff';
      })
      .attr('stroke-width', d => (hoveredNode === d.id || selectedNode === d.id) ? 3 : 2)
      .attr('opacity', d => {
        if (hoveredNode && hoveredNode !== d.id && highlightedRelations.length === 0) return 0.4;
        return 1;
      });

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'school' ? 45 : 38)
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', '#2C2416')
      .text(d => d.name);

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'school' ? 6 : 4)
      .attr('font-size', d => d.type === 'school' ? '14px' : '12px')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .text(d => d.type === 'school' ? '學' : '子');

    node.on('mouseover', function(event, d) {
      setHoveredNode(d.id);
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', d.type === 'school' ? 34 : 28);
    })
    .on('mouseout', function(event, d) {
      setHoveredNode(null);
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', d.type === 'school' ? 28 : 22);
    })
    .on('click', function(event, d) {
      event.stopPropagation();
      handleNodeClick(d.id);
    });

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!);

      linkLabel
        .attr('x', d => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2)
        .attr('y', d => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2 - 8);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [graphData, dimensions, highlightedRelations, hoveredNode, selectedNode, pathStartId, pathEndId]);

  const handleNodeClick = useCallback((nodeId: string) => {
    if (!pathStartId) {
      setPathStart(nodeId);
    } else if (!pathEndId && nodeId !== pathStartId) {
      setPathEnd(nodeId);
    } else {
      setSelectedNode(prev => prev === nodeId ? null : nodeId);
      clearPath();
    }
  }, [pathStartId, pathEndId, setPathStart, setPathEnd, clearPath]);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
    clearPath();
  }, [clearPath]);

  const selectedNodeData = useMemo(() => {
    if (!selectedNode) return null;
    return graphData.nodes.find(n => n.id === selectedNode) || null;
  }, [selectedNode, graphData.nodes]);

  return {
    svgRef,
    dimensions,
    setDimensions,
    hoveredNode,
    selectedNodeData,
    pathStartId,
    pathEndId,
    currentPath,
    calculatePath,
    clearPath,
    handleBackgroundClick,
  };
};
