import React from 'react'
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';         //^ useGLTF --> for accessing the 3D Model.

import state from '../store';       

const Shirt = () => {
    const snap = useSnapshot(state);
    const { nodes, materials } = useGLTF('/shirt_baked.glb');

    const logoTexture = useTexture(snap.logoDecal);   //^ contains the link to Logo png
    const fullTexture = useTexture(snap.fullDecal);   //^ contains link to the shirt

    useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta));

    const stateString = JSON.stringify(snap);   //^ Tracks the changes in state



  return (
    <group
      key={stateString}             //^ React will render the model, whenever state changes
    >
        <mesh
          castShadow
          geometry={nodes.T_Shirt_male.geometry}
          material={materials.lambert1}
          material-roughness={1}
          dispose={null}
        >
            {snap.isFullTexture && (
                <Decal
                  position = {[0,0,0]}
                  rotation = {[0,0,0]}
                  scale = {1}
                  map = {fullTexture}
                />
            )}
            
            {snap.isLogoTexture && (
                <Decal
                  position = {[0,0.04,0.15]}
                  rotation = {[0,0,0]}
                  scale = {0.15}
                  map = {logoTexture}
                //   map-anisotropy = {16}
                  depthTest = {false}            //^ to ensure to render on top of the other objects
                  depthWrite = {true}
                />
            )}
            
        </mesh>
    </group>
  )
}

export default Shirt
