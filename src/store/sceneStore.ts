import { create } from 'zustand';
import * as THREE from 'three';
import { SubdivisionModifier } from 'three/examples/jsm/modifiers/SubdivisionModifier';

interface SceneState {
  objects: Array<{
    id: string;
    object: THREE.Object3D;
    name: string;
    visible: boolean;
  }>;
  selectedObjectId: string | null;
  selectedVertices: number[];
  selectedEdges: number[];
  selectedFaces: number[];
  transformMode: 'translate' | 'rotate' | 'scale' | 'vertex' | 'edge' | 'face';
  addObject: (object: THREE.Object3D, name: string) => void;
  removeObject: (id: string) => void;
  setSelectedObject: (id: string | null) => void;
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale' | 'vertex' | 'edge' | 'face') => void;
  toggleVisibility: (id: string) => void;
  updateObjectName: (id: string, name: string) => void;
  updateObjectProperties: () => void;
  setSelectedVertices: (indices: number[]) => void;
  setSelectedEdges: (indices: number[]) => void;
  setSelectedFaces: (indices: number[]) => void;
  extrudeFaces: () => void;
  subdivide: () => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  objects: [],
  selectedObjectId: null,
  selectedVertices: [],
  selectedEdges: [],
  selectedFaces: [],
  transformMode: 'translate',
  addObject: (object, name) =>
    set((state) => ({
      objects: [...state.objects, { id: crypto.randomUUID(), object, name, visible: true }],
    })),
  removeObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((obj) => obj.id !== id),
      selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
    })),
  setSelectedObject: (id) => set({ 
    selectedObjectId: id,
    selectedVertices: [],
    selectedEdges: [],
    selectedFaces: []
  }),
  setTransformMode: (mode) => set({ transformMode: mode }),
  toggleVisibility: (id) =>
    set((state) => {
      const updatedObjects = state.objects.map((obj) =>
        obj.id === id ? { ...obj, visible: !obj.visible } : obj
      );
      
      const toggledObject = updatedObjects.find((obj) => obj.id === id);
      
      return {
        objects: updatedObjects,
        selectedObjectId: (toggledObject && !toggledObject.visible && id === state.selectedObjectId)
          ? null
          : state.selectedObjectId,
      };
    }),
  updateObjectName: (id, name) =>
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, name } : obj
      ),
    })),
  updateObjectProperties: () => set((state) => ({ ...state })),
  setSelectedVertices: (indices) => set({ selectedVertices: indices }),
  setSelectedEdges: (indices) => set({ selectedEdges: indices }),
  setSelectedFaces: (indices) => set({ selectedFaces: indices }),
  extrudeFaces: () => set((state) => {
    const selectedObject = state.objects.find(obj => obj.id === state.selectedObjectId)?.object;
    if (selectedObject && selectedObject instanceof THREE.Mesh) {
      const geometry = selectedObject.geometry.clone();
      const positions = geometry.getAttribute('position');
      const faces = state.selectedFaces;
      
      if (faces.length > 0) {
        // Create new vertices for extrusion
        const newPositions = new Float32Array([...positions.array]);
        const verticesPerFace = 3;
        
        faces.forEach(faceIndex => {
          const baseIndex = faceIndex * verticesPerFace;
          for (let i = 0; i < verticesPerFace; i++) {
            const vIndex = baseIndex + i;
            const x = positions.getX(vIndex);
            const y = positions.getY(vIndex);
            const z = positions.getZ(vIndex);
            
            // Extrude along face normal (simplified)
            newPositions[vIndex * 3] = x * 1.2;
            newPositions[vIndex * 3 + 1] = y * 1.2;
            newPositions[vIndex * 3 + 2] = z * 1.2;
          }
        });
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        geometry.computeVertexNormals();
        selectedObject.geometry = geometry;
      }
    }
    return state;
  }),
  subdivide: () => set((state) => {
    const selectedObject = state.objects.find(obj => obj.id === state.selectedObjectId)?.object;
    if (selectedObject && selectedObject instanceof THREE.Mesh) {
      const modifier = new SubdivisionModifier(1); // 1 subdivision level
      const smoothGeometry = modifier.modify(selectedObject.geometry);
      selectedObject.geometry = smoothGeometry;
      selectedObject.geometry.computeVertexNormals();
    }
    return state;
  })
}));