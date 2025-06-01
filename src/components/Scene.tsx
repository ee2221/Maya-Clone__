import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid } from '@react-three/drei';
import { useSceneStore } from '../store/sceneStore';
import { Ruler } from 'lucide-react';

const Scene: React.FC = () => {
  const { objects, selectedObject, setSelectedObject, transformMode, gridUnit, setGridUnit } = useSceneStore();

  // 1 inch = 2.54 cm
  const gridScale = gridUnit === 'inch' ? 2.54 : 1;

  return (
    <>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 75 }}
        className="w-full h-full bg-gray-900"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Grid
          infiniteGrid
          cellSize={gridScale}
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
                setSelectedObject(object);
              }}
            />
          )
        ))}

        {selectedObject && (
          <TransformControls
            object={selectedObject}
            mode={transformMode}
            // Scale the snap values based on the grid unit
            translationSnap={gridScale}
            rotationSnap={Math.PI / 12} // 15 degrees
            scaleSnap={gridScale * 0.5}
          />
        )}

        <OrbitControls makeDefault />
      </Canvas>

      <button
        onClick={() => setGridUnit(gridUnit === 'cm' ? 'inch' : 'cm')}
        className="absolute bottom-24 left-4 bg-white/90 rounded-lg shadow-lg p-2 flex items-center gap-2 hover:bg-white"
        title={`Switch to ${gridUnit === 'cm' ? 'inches' : 'centimeters'}`}
      >
        <Ruler className="w-4 h-4" />
        <span className="text-sm font-medium">{gridUnit.toUpperCase()}</span>
      </button>
    </>
  );
};

export default Scene;