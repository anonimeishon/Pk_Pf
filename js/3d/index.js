import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { particles } from './geometry/particles.js';
import {
  camera,
  cameraBasePosition,
  cameraTarget,
  getCameraAnimationState,
} from './camera/camera.js';
import { scene } from './scene.js';
import { controls } from './controls/controls.js';
import { cursor } from './helpers/cursorController.js';
import { motion, isMotionEnabled } from './helpers/phoneMotionController.js';
import { renderer } from './renderer/renderer.js';
import { directionalLight } from './light/directionalLight.js';
import { ambientLight } from './light/ambientLight.js';
import { canvasTexture } from './textures/canvasTexture.js';
import { dotMatrixMaterialBuilder } from './materials/dotMatrix.js';
import {
  ACTION_ZONE_A,
  ACTION_ZONE_B,
  CONTROL_KEYS,
  DPAD_ZONE,
} from '../constants/threeControls.js';

// 🎬 Scene
scene.background = new THREE.Color(0x000000);

// 💡 Lights

scene.add(directionalLight);

scene.add(ambientLight);

// Particles
scene.add(particles);

const motionBaseline = { x: 0, y: 0 };
let hasMotionBaseline = false;

const dotMatrixMaterial = dotMatrixMaterialBuilder(canvasTexture);
export const renderScreen = ({ renderCanvas }) => {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const interactiveButtons = [];
  let activeButton = null;

  const dispatchGameKey = (type, key) => {
    window.dispatchEvent(
      new KeyboardEvent(type, { key, bubbles: true, cancelable: true }),
    );
  };

  const meshNameToKey = (meshName = '') => {
    const name = meshName.toLowerCase();

    if (name.includes('up')) return CONTROL_KEYS.ArrowUp;
    if (name.includes('down')) return CONTROL_KEYS.ArrowDown;
    if (name.includes('left')) return CONTROL_KEYS.ArrowLeft;
    if (name.includes('right')) return CONTROL_KEYS.ArrowRight;

    // Map A button to Enter because the game already uses Enter as A.
    if (name === 'a' || name.includes('button_a') || name.includes('buttona')) {
      return CONTROL_KEYS.A;
    }

    if (name === 'b' || name.includes('button_b') || name.includes('buttonb')) {
      return CONTROL_KEYS.B;
    }

    return null;
  };

  const isInBox = (value, min, max) => value >= min && value <= max;
  const isNear = (value, center, halfSize) =>
    value >= center - halfSize && value <= center + halfSize;

  const keyFromHitPosition = (intersection) => {
    const object = intersection.object;
    const geometry = object.geometry;

    if (!geometry?.boundingBox) geometry?.computeBoundingBox();
    const bounds = geometry?.boundingBox;
    if (!bounds) return null;

    const localPoint = object.worldToLocal(intersection.point.clone());
    const width = bounds.max.x - bounds.min.x || 1;
    const depth = bounds.max.z - bounds.min.z || 1;
    const xN = (localPoint.x - bounds.min.x) / width;
    const zN = (localPoint.z - bounds.min.z) / depth;

    if (
      isNear(xN, ACTION_ZONE_A.centerX, ACTION_ZONE_A.halfSize) &&
      isNear(zN, ACTION_ZONE_A.centerZ, ACTION_ZONE_A.halfSize)
    ) {
      return CONTROL_KEYS.A;
    }

    if (
      isNear(xN, ACTION_ZONE_B.centerX, ACTION_ZONE_B.halfSize) &&
      isNear(zN, ACTION_ZONE_B.centerZ, ACTION_ZONE_B.halfSize)
    ) {
      return CONTROL_KEYS.B;
    }

    const dx = xN - DPAD_ZONE.centerX;
    const dz = zN - DPAD_ZONE.centerZ;

    const inDpadBounds =
      isInBox(xN, DPAD_ZONE.minX, DPAD_ZONE.maxX) &&
      isInBox(zN, DPAD_ZONE.minZ, DPAD_ZONE.maxZ);
    const outsideDeadZone =
      Math.abs(dx) > DPAD_ZONE.deadZone || Math.abs(dz) > DPAD_ZONE.deadZone;

    if (inDpadBounds && outsideDeadZone) {
      if (Math.abs(dx) > Math.abs(dz)) {
        return dx > 0 ? CONTROL_KEYS.ArrowRight : CONTROL_KEYS.ArrowLeft;
      }
      return dz > 0 ? CONTROL_KEYS.ArrowUp : CONTROL_KEYS.ArrowDown;
    }

    console.log('[3d-buttons] Unmapped hit zone', {
      name: object.name,
      xN: Number(xN.toFixed(3)),
      zN: Number(zN.toFixed(3)),
      localX: Number(localPoint.x.toFixed(3)),
      localY: Number(localPoint.y.toFixed(3)),
      localZ: Number(localPoint.z.toFixed(3)),
      uvX: Number((intersection.uv?.x ?? 0).toFixed(3)),
      uvY: Number((intersection.uv?.y ?? 0).toFixed(3)),
    });

    return null;
  };

  const updatePointerFromEvent = (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const getPressedButton = (event) => {
    if (!interactiveButtons.length) return null;

    updatePointerFromEvent(event);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(interactiveButtons, true);
    return hits[0] ?? null;
  };

  const onPointerDown = (event) => {
    const intersection = getPressedButton(event);
    if (!intersection) return;

    const keyByName = meshNameToKey(intersection.object.name);
    const key = keyByName ?? keyFromHitPosition(intersection);
    if (!key) {
      return;
    }

    // B exists physically, but game logic currently only uses Enter + arrows.
    if (key === CONTROL_KEYS.B) return;

    activeButton = { key, mesh: intersection.object };
    dispatchGameKey('keydown', key);
    event.preventDefault();
  };

  const onPointerUp = (event) => {
    if (!activeButton) return;

    dispatchGameKey('keyup', activeButton.key);
    activeButton = null;
    event.preventDefault();
  };

  renderer.domElement.addEventListener('pointerdown', onPointerDown, {
    passive: false,
  });
  window.addEventListener('pointerup', onPointerUp, { passive: false });
  window.addEventListener('pointercancel', onPointerUp, { passive: false });

  // 📦 Load model
  const loader = new GLTFLoader();

  loader.load('./assets/models/GBC.glb', (gltf) => {
    const model = gltf.scene;

    // Adjust if needed
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);

    model.traverse((child) => {
      // console.log('🚀 ~ index.js:194 ~ renderScreen ~ child.name:', child.name);
      // const children = child.children.map((child) => child.name);
      // if (children?.length) {
      //   console.log(
      //     '🚀 ~ index.js:198 ~ renderScreen ~ child.children.name:',
      //     children,
      //   );
      // }

      // if (child?.parent?.name) {
      //   console.log(
      //     '🚀 ~ index.js:205 ~ renderScreen ~ parent.name:',
      //     child?.parent?.name,
      //   );
      // }

      if (child.isMesh && child.parent?.name === 'Case') {
        const material = child.material;
        // GLTF base color map can multiply the chosen color and shift it green.
        if ('map' in material) material.map = null;
        if ('color' in material) material.color = new THREE.Color(0x8953a9);
        material.needsUpdate = true;
      }
      if (child.isMesh && child.parent?.name === 'Plastic') {
        // IMPORTANT buttons are in here
        // console.log(child);
        // child.material = new THREE.MeshStandardMaterial({
        //   color: 0xffffff,
        //   roughness: 0.3,
        //   metalness: 0.8,
        //   transparent: true,
        //   opacity: 0.9,
        // });

        interactiveButtons.push(child);
      }
      // console.log('================================');
      if (child.isMesh && child.parent?.name === 'Screen') {
        // Hide the original atlas-mapped mesh
        // child.visible = false;

        // Build a replacement plane as a child of the same "Screen" Object3D
        // so it inherits the exact world transform. PlaneGeometry has clean 0→1 UVs.
        const screenParent = child.parent; // the "Screen" Object3D

        // Match the original mesh's local transform so it sits flush on the screen.
        const geo = new THREE.PlaneGeometry(1, 1);
        const plane = new THREE.Mesh(geo, dotMatrixMaterial);

        /**
         * With this position config
         * and setting child.visible = false, the screen will not get rendered
         * which means there will be more space for the canvas texture
         */

        // child.visible = false;

        //  plane.position.copy({
        //   x: child.position.x + 0.035,
        //   y: child.position.y - 0.4,
        //   z: child.position.z + 0.3,
        // }); // slight offset to prevent z-fighting
        // // plane.quaternion.copy(child.quaternion);
        // geo.rotateX(Math.PI * 0.5); // orient flat in the XZ plane
        // plane.scale.copy({
        //   x: child.scale.x + 0.2,
        //   y: child.scale.y,
        //   z: child.scale.z + 0.1,
        // });

        plane.position.copy({
          x: child.position.x + 0.04,
          // y: child.position.y - 0.39,
          y: child.position.y - 0.41,
          z: child.position.z + 0.35,
        }); // slight offset to prevent z-fighting
        // plane.quaternion.copy(child.quaternion);
        geo.rotateX(Math.PI * 0.5); // orient flat in the XZ plane
        plane.scale.copy({
          x: child.scale.x - 0.18,
          y: child.scale.y + 0.1,
          z: child.scale.z - 0.26,
        });

        screenParent.add(plane);
      }
    });

    scene.add(model);
  });

  // 🔄 Animation loop
  function animate() {
    requestAnimationFrame(animate);

    const animationState = getCameraAnimationState();

    // Calibrate once so gravity bias does not keep the camera permanently offset.
    if (
      !hasMotionBaseline &&
      (Math.abs(motion.x) > 0.3 || Math.abs(motion.y) > 0.3)
    ) {
      motionBaseline.x = motion.x;
      motionBaseline.y = motion.y;
      hasMotionBaseline = true;
    }

    // Keep parallax as an offset around the animated base camera pose.
    const parallaxStrength = 0.6;
    const motionXNorm = hasMotionBaseline
      ? THREE.MathUtils.clamp((motion.x - motionBaseline.x) / 9.81, -1, 1)
      : 0;
    const motionYNorm = hasMotionBaseline
      ? THREE.MathUtils.clamp((motion.y - motionBaseline.y) / 9.81, -1, 1)
      : 0;

    const motionEnabled = isMotionEnabled();
    const offsetX = animationState.isAnimating
      ? 0
      : (cursor.x + (motionEnabled ? motionXNorm : 0)) * parallaxStrength;
    const offsetY = animationState.isAnimating
      ? 0
      : -(cursor.y + (motionEnabled ? motionYNorm : 0)) * parallaxStrength;
    const targetX = cameraBasePosition.x + offsetX;
    const targetY = cameraBasePosition.y + offsetY;
    const follow = animationState.isAnimating ? 1 : 0.08;

    camera.position.x += (targetX - camera.position.x) * follow;
    camera.position.y += (targetY - camera.position.y) * follow;
    camera.position.z += (cameraBasePosition.z - camera.position.z) * follow;

    controls.target.copy(cameraTarget);
    canvasTexture.needsUpdate = true;
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // 📱 Resize handling
  window.addEventListener('resize', () => {
    camera.aspect = renderCanvas.clientWidth / renderCanvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      renderCanvas.clientWidth,
      renderCanvas.clientHeight,
      false,
    );
  });
};
