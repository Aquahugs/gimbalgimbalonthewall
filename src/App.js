import React, { useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";

function Cube() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function GimbalCube({ setOrbitEnabled, snapEnabled, mode, orientation, setOrientation }) {
  const transformRef = useRef();
  const { camera, gl } = useThree();

  useEffect(() => {
    const controls = transformRef.current;
    if (!controls) return;

    // Set the mode and orientation
    controls.setMode(mode); // translate, rotate, scale
    controls.setSpace(orientation); // "local" or "world"

    // Enable snapping for translate/rotate/scale
    if (snapEnabled) {
      if (mode === "translate") {
        controls.translationSnap = 1; // Snap to 1 unit
      } else if (mode === "rotate") {
        controls.rotationSnap = Math.PI / 18; // Snap to 10 degrees
      } else if (mode === "scale") {
        controls.scaleSnap = 0.1; // Snap scale to 0.1 increments
      }
    } else {
      controls.translationSnap = null;
      controls.rotationSnap = null;
      controls.scaleSnap = null;
    }
  }, [snapEnabled, mode, orientation]);

  const onPointerDown = () => {
    setOrbitEnabled(false); // Ensure camera controls are off
  };

  const onPointerUp = () => {
    setOrbitEnabled(true); // Ensure camera controls are off
  };

  const onKeyDown = (event) => {
    if (event.key === "Alt") {
      setOrientation((prev) => (prev === "local" ? "world" : "local")); // Toggle orientation
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <TransformControls
      ref={transformRef}
      args={[camera, gl.domElement]}
      mode={mode}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <Cube />
    </TransformControls>
  );
}

function App() {
  const [snapEnabled, setSnapEnabled] = useState(false); // Enable/Disable snapping
  const [mode, setMode] = useState("translate"); // Current transform mode
  const [orientation, setOrientation] = useState("world"); // Local or world orientation

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#dcdcdc" }}>
      
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} orthographic={false}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />

        {/* Gimbal Controls */}
        <GimbalCube
          setOrbitEnabled={() => {}} // Ensure OrbitControls is never used
          snapEnabled={snapEnabled}
          mode={mode}
          orientation={orientation}
          setOrientation={setOrientation}
        />
      </Canvas>

      {/* UI Controls */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          padding: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          borderRadius: "5px",
        }}
      >
        <h4>Transform Controls:</h4>
        <button
          style={{
            margin: "5px",
            padding: "5px 10px",
            cursor: "pointer",
            backgroundColor: mode === "translate" ? "green" : "gray",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
          onClick={() => setMode("translate")}
        >
          Translate
        </button>
        <button
          style={{
            margin: "5px",
            padding: "5px 10px",
            cursor: "pointer",
            backgroundColor: mode === "rotate" ? "green" : "gray",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
          onClick={() => setMode("rotate")}
        >
          Rotate
        </button>
        <button
          style={{
            margin: "5px",
            padding: "5px 10px",
            cursor: "pointer",
            backgroundColor: mode === "scale" ? "green" : "gray",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
          onClick={() => setMode("scale")}
        >
          Scale
        </button>
        <button
          style={{
            marginTop: "10px",
            padding: "5px 10px",
            cursor: "pointer",
            backgroundColor: snapEnabled ? "green" : "red",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
          onClick={() => setSnapEnabled((prev) => !prev)}
        >
          {snapEnabled ? "Disable Snapping" : "Enable Snapping"}
        </button>
        <p style={{ marginTop: "10px" }}>Orientation: {orientation}</p>
        <p>Press <b>Alt</b> to toggle between Local and World space</p>
      </div>
    </div>
  );
}

export default App;
