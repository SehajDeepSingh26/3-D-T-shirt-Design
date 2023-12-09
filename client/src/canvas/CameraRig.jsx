import React, {useRef} from 'react'
import { useSnapshot } from 'valtio'
import {easing} from 'maath'
import { useFrame } from '@react-three/fiber'

import state from '../store'

const Camerarig = ({ children }) => {       //^ To move the camera 
    const group = useRef();
    const snap = useSnapshot(state)

    useFrame((state, delta) => {

                         //^ To make the Tshirt Responsive
        const isBreakPoint = window.innerWidth <= 1660;
        const isMobile = window.innerHeight <= 600;

                         //^ set initial position of model
        let targetPosition = [-0.4, 0, 2]
        if(snap.intro){
            if(isBreakPoint)
                targetPosition = [0, 0.6, 2];
            if(isMobile) 
                targetPosition = [0, 1.3, 2.5]
        }
        else{
            if(isMobile) 
                targetPosition = [0, 0, 2.5]
            else
                targetPosition = [0, 0, 2]
        }

                        //^ Set Model Camera Position
        easing.damp3(
            state.camera.position, 
            targetPosition,
            0.25,   // smooth moving time
            delta
        )


                        //^ Set the model rotation smoothly
        easing.dampE(
            group.current.rotation,
            [state.pointer.y / 10, -state.pointer.x / 5, 0],
            0.25,    // smooth moving time
            delta
        )

    })

  return (
    <group ref={group}>
        {children}
    </group>
  )
}

export default Camerarig
