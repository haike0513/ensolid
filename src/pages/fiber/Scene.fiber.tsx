import { createSignal, type Component, type VoidComponent } from "solid-js";
import { useFrame, extend, type ThreeEvent, type Instance } from "@ensolid/fiber";
import * as THREE from "three";

// Register components for type safety and lookup
extend({
  Mesh: THREE.Mesh,
  BoxGeometry: THREE.BoxGeometry,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  AmbientLight: THREE.AmbientLight,
  PointLight: THREE.PointLight,
  SpotLight: THREE.SpotLight,
  Group: THREE.Group,
});

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      group: any;
      [key: string]: any;
    }
  }
}

interface BoxProps {
  position?: [number, number, number];
  [key: string]: any;
}

const Box: Component<BoxProps> = (props) => {
  // Idiomatic SolidJS ref usage
  let ref!: Instance;
  
  // Idiomatic SolidJS signals
  const [hovered, setHover] = createSignal(false);
  const [clicked, setClick] = createSignal(false);
  
  useFrame((state, delta) => {
    // Access the underlying THREE object via the Instance wrapper
    if (ref?.object) ref.object.rotation.x += delta;
  });
  
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked() ? 1.5 : 1}
      onClick={() => setClick((c) => !c)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered() ? 'hotpink' : 'orange'} />
    </mesh>
  );
};

export const FiberScene: VoidComponent = () => {
  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </>
  );
};
