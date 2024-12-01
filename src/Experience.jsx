import {
    useGLTF,
    OrbitControls,
    useTexture,
    Center,
    Sky,
    Sparkles,
    shaderMaterial
} from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'

import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'

const PortalMaterial = shaderMaterial({
    uTime: 0,
    uColorStart: new THREE.Color('hotpink'),
    uColorEnd: new THREE.Color('#ff0077'),
    vertexShader: portalVertexShader,
    fragmentShader: portalFragmentShader
})

extend({ PortalMaterial })

export default function Experience()
{
    const { nodes } = useGLTF('./model/portal.glb')
    const bakedTexture = useTexture('./model/baked.jpg')
    bakedTexture.flipY = false

    const portalMaterial = useRef()

    useFrame(({ clock }) => {
        portalMaterial.current.uTime = clock.getElapsedTime()
    })

    return <>
        <Sky
            sunPosition={[10, 10, 100]}
        />

        <color attach="background" args={ ['#030202'] } />

        <OrbitControls makeDefault />

        <Center>
            <mesh geometry={nodes.baked.geometry}>
                <meshBasicMaterial map={bakedTexture} />
            </mesh>
            <mesh
                geometry={nodes.poleLightA.geometry}
                position={nodes.poleLightA.position}
            >
                <meshBasicMaterial color="#ffffee" />
            </mesh>
            <mesh
                geometry={nodes.poleLightB.geometry}
                position={nodes.poleLightB.position}
            >
                <meshBasicMaterial color="#ffffee" />
            </mesh>
            <mesh
                geometry={nodes.portalLight.geometry}
                position={nodes.portalLight.position}
                rotation={nodes.portalLight.rotation}
            >
                <portalMaterial ref={ portalMaterial } />
            </mesh>

            <Sparkles
                scale={[ 4, 2, 4 ]}
                size={6}
                position-y={1.5}
                speed={0.1}
                count={100}
            />
        </Center>
    </>
}