import { create } from 'zustand';
import * as THREE from 'three';

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
      const geometry = selectedObject.geometry as THREE.BufferGeometry;
      if (state.selectedFaces.length > 0) {
        const positions = geometry.getAttribute('position');
        const indices = geometry.getIndex();
        
        // Extrude logic would go here
        // This is a simplified version - would need proper geometry manipulation
        
        geometry.computeVertexNormals();
        positions.needsUpdate = true;
        if (indices) indices.needsUpdate = true;
      }
    }
    return state;
  }),
  subdivide: () => set((state) => {
    const selectedObject = state.objects.find(obj => obj.id === state.selectedObjectId)?.object;
    if (selectedObject && selectedObject instanceof THREE.Mesh) {
      const geometry = selectedObject.geometry as THREE.BufferGeometry;
      // Subdivision logic would go here
      // This would create new vertices and faces for smoother geometry
      geometry.computeVertexNormals();
    }
    return state;
  })
}));