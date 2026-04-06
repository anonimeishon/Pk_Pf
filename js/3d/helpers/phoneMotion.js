export const createPhoneMotion = ({ domElement }) => {
  const motion = { x: 0, y: 0, z: 0 };
  let isEnabled = false;

  const phoneMotionHandler = (event) => {
    const acceleration = event.accelerationIncludingGravity;

    motion.x = acceleration?.x ?? 0;
    motion.y = acceleration?.y ?? 0;
    motion.z = acceleration?.z ?? 0;
  };

  const enablePhoneMotion = () => {
    if (isEnabled) return;
    // Permission is requested separately (from a user-gesture context) in index.js.
    // Here we just register the listener; on iOS, events start flowing once
    // DeviceMotionEvent.requestPermission() has been granted by the caller.
    window.addEventListener('devicemotion', phoneMotionHandler);
    isEnabled = true;
  };

  const disablePhoneMotion = () => {
    if (isEnabled) {
      window.removeEventListener('devicemotion', phoneMotionHandler);
      isEnabled = false;
    }
    motion.x = 0;
    motion.y = 0;
    motion.z = 0;
  };

  enablePhoneMotion();

  return {
    motion,
    isMotionEnabled: () => isEnabled,
    enablePhoneMotion,
    disablePhoneMotion,
  };
};
