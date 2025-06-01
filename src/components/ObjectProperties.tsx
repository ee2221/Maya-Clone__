import React from 'react';
import { useSceneStore } from '../store/sceneStore';
import { X, Maximize2, Layers } from 'lucide-react';

const ObjectProperties: React.FC = () => {
  const { 
    objects,
    selectedObjectId, 
    updateObjectProperties, 
    transformMode,
    selectedVertices,
    selectedEdges,
    selectedFaces,
    extrudeFaces,
    subdivide
  } = useSceneStore();

  const selectedObject = objects.find(obj => obj.id === selectedObjectId && obj.visible)?.object;

  if (!selectedObject) return null;

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    selectedObject.position[axis] = value;
    updateObjectProperties();
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    selectedObject.rotation[axis] = (value * Math.PI) / 180;
    updateObjectProperties();
  };

  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: number) => {
    selectedObject.scale[axis] = value;
    updateObjectProperties();
  };

  return (
    <div className="absolute right-72 top-4 bg-white rounded-lg shadow-lg p-4 w-64">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Properties</h2>
        <button
          onClick={() => useSceneStore.getState().setSelectedObject(null)}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Position</h3>
          <div className="grid grid-cols-3 gap-2">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <div key={`pos-${axis}`}>
                <label className="text-xs text-gray-500 uppercase">{axis}</label>
                <input
                  type="number"
                  value={selectedObject.position[axis]}
                  onChange={(e) => handlePositionChange(axis, parseFloat(e.target.value))}
                  step="0.1"
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Rotation (degrees)</h3>
          <div className="grid grid-cols-3 gap-2">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <div key={`rot-${axis}`}>
                <label className="text-xs text-gray-500 uppercase">{axis}</label>
                <input
                  type="number"
                  value={(selectedObject.rotation[axis] * 180) / Math.PI}
                  onChange={(e) => handleRotationChange(axis, parseFloat(e.target.value))}
                  step="5"
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Scale</h3>
          <div className="grid grid-cols-3 gap-2">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <div key={`scale-${axis}`}>
                <label className="text-xs text-gray-500 uppercase">{axis}</label>
                <input
                  type="number"
                  value={selectedObject.scale[axis]}
                  onChange={(e) => handleScaleChange(axis, parseFloat(e.target.value))}
                  step="0.1"
                  min="0.1"
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {(transformMode === 'vertex' || transformMode === 'edge' || transformMode === 'face') && (
          <div>
            <h3 className="font-medium mb-2">Polygon Tools</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-500">Selected: </span>
                {transformMode === 'vertex' && `${selectedVertices.length} vertices`}
                {transformMode === 'edge' && `${selectedEdges.length} edges`}
                {transformMode === 'face' && `${selectedFaces.length} faces`}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={extrudeFaces}
                  disabled={transformMode !== 'face' || selectedFaces.length === 0}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Maximize2 className="w-4 h-4" /> Extrude
                </button>
                <button
                  onClick={subdivide}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                >
                  <Layers className="w-4 h-4" /> Subdivide
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectProperties;