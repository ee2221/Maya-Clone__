import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid } from '@react-three/drei';
import { useSceneStore } from '../store/sceneStore';
import { Object3D } from 'three';

const Scene: React.FC = () => {
  const { objects, selectedObjectId, setSelectedObject, transformMode } = useSceneStore();
  const selectedObject = objects.find(obj => obj.id === selectedObjectId && obj.visible)?.object;
  
  // Only use the selected object for transform controls if it's a valid Object3D instance
  const objectForTransformControls = selectedObject instanceof Object3D ? selectedObject : null;

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

      {objectForTransformControls && (
        <TransformControls
          key={selectedObjectId}
          object={objectForTransformControls}
          mode={transformMode}
        />
      )}

      <OrbitControls makeDefault />
    </Canvas>
  );
};

export default Scene;