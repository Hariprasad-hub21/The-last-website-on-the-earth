import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ServerVaultProps {
  onDiscoverEgg?: (id: string) => void;
}

export const ServerVault: React.FC<ServerVaultProps> = ({ onDiscoverEgg }) => {
  const fansRef = useRef<THREE.Group[]>([]);
  const beaconRef = useRef<THREE.PointLight>(null);
  const screenRef = useRef<THREE.MeshBasicMaterial>(null);

  // Server rack positions (left and right columns along z-axis)
  const serverRacks = useMemo(() => {
    const racks = [];
    for (let z = 10; z >= -8; z -= 3.5) {
      racks.push({ x: -6, z, rotY: Math.PI / 2 });
      racks.push({ x: 6, z, rotY: -Math.PI / 2 });
    }
    return racks;
  }, []);

  // Floor conduit lines
  const conduitLines = useMemo(() => {
    return [-4, -2, 0, 2, 4];
  }, []);

  // Hanging ceiling cables (catenary curve points)
  const cables = useMemo(() => {
    const cableCurves = [];
    for (let i = 0; i < 4; i++) {
      const z = 8 - i * 4.5;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-7, 6.8, z),
        new THREE.Vector3(-3.5, 5.2 - (i % 2) * 0.4, z + 0.3),
        new THREE.Vector3(0, 4.8 - (i % 2) * 0.5, z),
        new THREE.Vector3(3.5, 5.3 - (i % 2) * 0.4, z - 0.3),
        new THREE.Vector3(7, 6.8, z),
      ]);
      cableCurves.push(curve);
    }
    return cableCurves;
  }, []);

  useFrame((state, delta) => {
    fansRef.current.forEach((fan, i) => {
      if (fan) fan.rotation.z += delta * (4 + (i % 3));
    });

    if (beaconRef.current) {
      // Periodic warning beacon pulse
      beaconRef.current.intensity = 1.2 + Math.sin(state.clock.elapsedTime * 4) * 0.8;
    }

    if (screenRef.current) {
      screenRef.current.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 6) * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Floor - Dark Metallic Grating */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 40]} />
        <meshStandardMaterial
          color="#060911"
          roughness={0.55}
          metalness={0.85}
        />
      </mesh>

      {/* Emissive Floor Conduits */}
      {conduitLines.map((x, i) => (
        <mesh key={`conduit-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, 0]}>
          <planeGeometry args={[0.08, 38]} />
          <meshBasicMaterial
            color={i === 2 ? '#38bdf8' : '#0284c7'}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Hanging Industrial Cables across Ceiling */}
      {cables.map((curve, idx) => (
        <mesh key={`cable-${idx}`}>
          <tubeGeometry args={[curve, 32, 0.05, 8, false]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.4} />
        </mesh>
      ))}

      {/* Industrial Conduit Wall Pipes (Left & Right) */}
      {[-7.2, 7.2].map((xSide, sideIdx) => (
        <group key={`pipes-side-${sideIdx}`} position={[xSide, 0, 0]}>
          {/* Main Coolant Trunk Pipe */}
          <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 38, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 38, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.25} />
          </mesh>
          {/* Pipe Joint Collars */}
          {[-12, -6, 0, 6, 12].map((zPos, jIdx) => (
            <mesh key={`collar-${jIdx}`} position={[0, 1.2, zPos]}>
              <cylinderGeometry args={[0.28, 0.28, 0.3, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.2} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Pulsing Warning Beacon light on Ceiling */}
      <group position={[0, 6.8, 2]}>
        <pointLight ref={beaconRef} color="#f59e0b" distance={15} intensity={1.5} decay={2} />
        <mesh>
          <cylinderGeometry args={[0.2, 0.3, 0.4, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* Wall Diagnostic Monitors / Status Screens */}
      <group position={[-6.8, 3.2, 2]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[1.8, 1.1, 0.15]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[1.6, 0.9]} />
          <meshBasicMaterial ref={screenRef} color="#0284c7" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Abandoned Diagnostic Tech Cart on Floor */}
      <group position={[3.2, 0.4, 4]} rotation={[0, -0.4, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1.2, 0.7, 0.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.8, 0.1, 0.5]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        {/* Wheels */}
        {[-0.45, 0.45].map((wx, wIdx) =>
          [-0.3, 0.3].map((wz, wzIdx) => (
            <mesh key={`wheel-${wIdx}-${wzIdx}`} position={[wx, -0.25, wz]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* Ceiling Metal Trusses & Cable Trays */}
      <group position={[0, 7.5, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[24, 40]} />
          <meshStandardMaterial color="#04060a" roughness={0.9} />
        </mesh>
        {[-8, -4, 0, 4, 8].map((z, idx) => (
          <group key={`truss-${idx}`} position={[0, -0.5, z]}>
            <mesh>
              <boxGeometry args={[20, 0.3, 0.5]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Hanging LED strip */}
            <mesh position={[0, -0.25, 0]}>
              <boxGeometry args={[14, 0.05, 0.1]} />
              <meshBasicMaterial color="#0284c7" transparent opacity={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Flanking Server Towers */}
      {serverRacks.map((rack, idx) => (
        <group key={`rack-${idx}`} position={[rack.x, 2.5, rack.z]} rotation={[0, rack.rotY, 0]}>
          {/* Main Chassis */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.4, 5.0, 1.2]} />
            <meshStandardMaterial
              color="#0b1120"
              metalness={0.85}
              roughness={0.35}
            />
          </mesh>

          {/* Front Panel Grid & Glass */}
          <mesh position={[0, 0, 0.62]}>
            <planeGeometry args={[2.1, 4.6]} />
            <meshStandardMaterial
              color="#020617"
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.85}
            />
          </mesh>

          {/* Blinking Diagnostic LEDs */}
          {[-1.8, -1.0, -0.2, 0.6, 1.4, 1.9].map((yOffset, ledRowIdx) => (
            <group key={`led-row-${ledRowIdx}`} position={[0, yOffset, 0.63]}>
              {[-0.8, -0.4, 0, 0.4, 0.8].map((xOffset, colIdx) => {
                const isAmber = (idx + colIdx) % 5 === 0;
                const isCyan = (idx + colIdx) % 3 === 0;
                const color = isAmber ? '#f59e0b' : isCyan ? '#38bdf8' : '#10b981';
                return (
                  <mesh key={`led-${colIdx}`} position={[xOffset, 0, 0]}>
                    <boxGeometry args={[0.08, 0.08, 0.02]} />
                    <meshBasicMaterial color={color} />
                  </mesh>
                );
              })}
            </group>
          ))}

          {/* Cooling Fan Unit */}
          <group
            position={[0, -2.1, 0.61]}
            ref={(el) => {
              if (el) fansRef.current[idx] = el;
            }}
          >
            <mesh>
              <ringGeometry args={[0.2, 0.4, 6]} />
              <meshBasicMaterial color="#334155" wireframe />
            </mesh>
          </group>
        </group>
      ))}

      {/* Hydraulic Archway to Archive */}
      <group position={[0, 3.5, -9.5]}>
        <mesh position={[-4.5, 0, 0]}>
          <boxGeometry args={[1.5, 7, 1.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.4} />
        </mesh>
        <mesh position={[4.5, 0, 0]}>
          <boxGeometry args={[1.5, 7, 1.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.4} />
        </mesh>
        <mesh position={[0, 3.2, 0]}>
          <boxGeometry args={[10.5, 1.2, 1.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.4} />
        </mesh>
        {/* Archway Neon Glow */}
        <mesh position={[0, 3.0, 0.8]}>
          <boxGeometry args={[8, 0.1, 0.1]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Easter Egg: 404 Sealed Hatch at the back */}
      <group
        position={[-8, 1.8, 16]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={() => onDiscoverEgg?.('egg-404')}
      >
        <mesh castShadow>
          <boxGeometry args={[2.5, 3.2, 0.3]} />
          <meshStandardMaterial color="#1c1917" roughness={0.8} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.8, 0.16]}>
          <planeGeometry args={[1.6, 0.5]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
    </group>
  );
};
