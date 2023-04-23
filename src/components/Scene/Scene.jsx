import { useEffect, useRef } from "react";
import { cleanUpScene, initScene, loadDrone, loadModels } from "./Script";

const Scene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    initScene(mountRef);
    loadDrone();
    loadModels('./model/base/Base.gltf', 'base');
    loadModels('./model/motor/Motor1.gltf', 'motor');
    loadModels('./model/cam/Cam1.gltf', 'camaras');
    loadModels('./model/helices/Helice1.gltf', 'helices');
    

    return () => {
      cleanUpScene();
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ height: '100vh', width: '100vw' }}>
      </div>
    </>
  );
};

export default Scene;
