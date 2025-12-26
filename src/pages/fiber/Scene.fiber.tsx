import { createSignal } from 'solid-js';
import { useFrame } from '@ensolid/fiber';

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      pointLight: any;
      group: any;
      [key: string]: any;
    }
  }
}

// ... (declarations omitted, assumed present or handled)

export const FiberScene = () => {
  const [rotation, setRotation] = createSignal([0, 0, 0] as [number, number, number]);

  useFrame((state: any, delta: number) => {
    setRotation(r => [r[0] + delta, r[1] + delta, r[2]]);
  });

  return (
    <group>
       <ambientLight intensity={0.5} />
       <pointLight position={[10, 10, 10]} />
       <mesh rotation={rotation()}>
         <boxGeometry args={[1, 1, 1]} />
         <meshStandardMaterial color="orange" />
       </mesh>
       <mesh position={[2, 0, 0]} rotation={rotation()}>
         <boxGeometry args={[1, 1, 1]} />
         <meshStandardMaterial color="hotpink" />
       </mesh>
    </group>
  );
};
