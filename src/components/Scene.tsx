import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid } from '@react-three/drei';
import { useSceneStore } from '../store/sceneStore';
import { Object3D } from 'three';

const Scene: React.FC = () => {
  const { objects, selectedObjectId, setSelectedObject, transformMode } = useSceneStore();
  const selectedObject = objects.find(obj => obj.id === selectedObjectId && obj.visible)?.object;

  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 75 }}
      className="w-full h-full bg-gray-900"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Grid
        infiniteGrid
        cellSize={1}
        sectionSize={3}
        fadeDistance={30}
        fadeStrength={1}
      />

      {objects.map(({ object, visible, id }) => (
        visible && (
          <primitive
            key={id}
            object={object}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedObject(id);
            }}
          />
        )
      ))}

      {selectedObject && selectedObject instanceof Object3D && (
        <TransformControls
          object={selectedObject}
          mode={transformMode}
        />
      )}

      <OrbitControls makeDefault />
    </Canvas>
  );
};

export default Scene;