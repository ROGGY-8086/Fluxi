import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Hero3DCanvasProps {
  reducedMotion?: boolean;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ reducedMotion = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    if (reducedMotion) return;
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = currentMount.clientWidth || 360;
    const height = currentMount.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Group for the 3D architectural neural lattice
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Isometric Wireframe Neuro-Cube Structure (Architectural linework style)
    const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
    const boxEdges = new THREE.EdgesGeometry(boxGeometry);
    const boxLineMaterial = new THREE.LineBasicMaterial({
      color: 0x121316,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
    });
    const boxWireframe = new THREE.LineSegments(boxEdges, boxLineMaterial);
    mainGroup.add(boxWireframe);

    // 2. Inner Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(1.6, 1);
    const icoEdges = new THREE.EdgesGeometry(icoGeometry);
    const icoLineMaterial = new THREE.LineBasicMaterial({
      color: 0x646675,
      linewidth: 1,
      transparent: true,
      opacity: 0.5,
    });
    const icoWireframe = new THREE.LineSegments(icoEdges, icoLineMaterial);
    mainGroup.add(icoWireframe);

    // 3. Floating Signal Nodes (Yellow signal spheres)
    const nodeGeometry = new THREE.SphereGeometry(0.08, 12, 12);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xf5b800 });
    const nodes: THREE.Mesh[] = [];

    const positions = [
      [1.5, 1.5, 1.5],
      [-1.5, 1.5, 1.5],
      [1.5, -1.5, 1.5],
      [-1.5, -1.5, 1.5],
      [1.5, 1.5, -1.5],
      [-1.5, 1.5, -1.5],
      [1.5, -1.5, -1.5],
      [-1.5, -1.5, -1.5],
      [0, 1.8, 0],
      [0, -1.8, 0],
      [1.8, 0, 0],
      [-1.8, 0, 0],
    ];

    positions.forEach(([x, y, z]) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(x, y, z);
      mainGroup.add(node);
      nodes.push(node);
    });

    // 4. Subtle Orbital Ring
    const ringGeometry = new THREE.TorusGeometry(2.4, 0.015, 8, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x121316,
      transparent: true,
      opacity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 3;
    mainGroup.add(ring);

    // Initial slight isometric tilt
    mainGroup.rotation.x = 0.35;
    mainGroup.rotation.y = 0.45;

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0.35;
    let targetY = 0.45;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.4;
      mouseY = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth rotation with mouse influence
      targetX = 0.35 + mouseY * 0.5;
      targetY = 0.45 + mouseX * 0.8 + elapsedTime * 0.15;

      mainGroup.rotation.x += (targetX - mainGroup.rotation.x) * 0.05;
      mainGroup.rotation.y += (targetY - mainGroup.rotation.y) * 0.05;
      ring.rotation.z = elapsedTime * 0.2;

      // Pulse nodes subtly
      const scale = 1 + Math.sin(elapsedTime * 3) * 0.15;
      nodes.forEach((n) => n.scale.set(scale, scale, scale));

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [reducedMotion]);

  if (reducedMotion || !webglSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <svg
          viewBox="0 0 300 300"
          className="w-64 h-64 opacity-80"
          fill="none"
          stroke="#121316"
          strokeWidth="1.5"
        >
          {/* Static high-detail architectural isometric fallback */}
          <polygon points="150,30 270,100 270,220 150,290 30,220 30,100" fill="#FFFDF8" />
          <line x1="150" y1="30" x2="150" y2="290" />
          <line x1="150" y1="160" x2="270" y2="100" />
          <line x1="150" y1="160" x2="30" y2="100" />
          <circle cx="150" cy="160" r="8" fill="#F5B800" stroke="#121316" strokeWidth="2" />
          <circle cx="270" cy="100" r="6" fill="#F5B800" stroke="#121316" strokeWidth="2" />
          <circle cx="30" cy="100" r="6" fill="#F5B800" stroke="#121316" strokeWidth="2" />
          <circle cx="150" cy="30" r="6" fill="#121316" />
          <circle cx="150" cy="290" r="6" fill="#121316" />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing pointer-events-auto"
      style={{ minHeight: '340px' }}
      aria-label="Interactive 3D isometric cognitive lattice illustration"
    />
  );
};
