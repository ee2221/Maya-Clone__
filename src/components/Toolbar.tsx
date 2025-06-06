import React from 'react';
import { Cuboid, Cherry, Cylinder, Cone, Pyramid, Move, RotateCw, Maximize, Sun } from 'lucide-react';
import { useSceneStore } from '../store/sceneStore';
import * as THREE from 'three';

const Toolbar: React.FC = () => {
  const { addObject, setTransformMode, transformMode } = useSceneStore();

  const createObject = (geometry: THREE.BufferGeometry, name: string) => {
    const material = new THREE.MeshStandardMaterial({ color: 0x44aa88 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    addObject(mesh, name);
  };

  const tools = [
    {
      icon: Move,
      mode: 'translate',
      title: 'Move Tool',
    },
    {
      icon: RotateCw,
      mode: 'rotate',
      title: 'Rotate Tool',
    },
    {
      icon: Maximize,
      mode: 'scale',
      title: 'Scale Tool',
    },
  ] as const;

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => createObject(new THREE.BoxGeometry(), 'Cube')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Add Cube"
        >
          <Cuboid className="w-6 h-6" />
        </button>
        <button
          onClick={() => createObject(new THREE.SphereGeometry(0.5, 32, 32), 'Sphere')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Add Sphere"
        >
          <Cherry className="w-6 h-6" />
        </button>
        <button
          onClick={() => createObject(new THREE.CylinderGeometry(0.5, 0.5, 1, 32), 'Cylinder')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Add Cylinder"
        >
          <Cylinder className="w-6 h-6" />
        </button>
        <button
          onClick={() => createObject(new THREE.ConeGeometry(0.5, 1, 32), 'Cone')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Add Cone"
        >
          <Cone className="w-6 h-6" />
        </button>
        <button
          onClick={() => createObject(new THREE.TetrahedronGeometry(0.5), 'Tetrahedron')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Add Tetrahedron"
        >
          <Pyramid className="w-6 h-6" />
        </button>
        <div className="h-px bg-gray-200 my-2" />
        {tools.map(({ icon: Icon, mode, title }) => (
          <button
            key={mode}
            onClick={() => setTransformMode(mode)}
            className={`p-2 rounded-lg transition-colors ${
              transformMode === mode ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title={title}
          >
            <Icon className="w-6 h-6" />
          </button>
        ))}
        <div className="h-px bg-gray-200 my-2" />
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Add Light"
        >
          <Sun className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default Toolbar;