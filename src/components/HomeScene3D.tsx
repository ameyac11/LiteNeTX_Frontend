
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Icosahedron, Environment, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedShape() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Icosahedron args={[1, 1]} ref={meshRef}>
                <meshStandardMaterial
                    color="#3b82f6" // blue-500
                    roughness={0.3}
                    metalness={0.8}
                    envMapIntensity={1}
                    flatShading
                />
                <lineSegments>
                    <edgesGeometry args={[new THREE.IcosahedronGeometry(1, 1)]} />
                    <lineBasicMaterial color="#60a5fa" transparent opacity={0.3} />
                </lineSegments>
            </Icosahedron>
        </Float>
    );
}

export default function HomeScene3D() {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={1}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                />

                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <AnimatedShape />

                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
