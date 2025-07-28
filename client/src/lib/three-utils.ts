// Utility functions for Three.js globe rendering
export function createSphereGeometry(radius: number = 1, widthSegments: number = 32, heightSegments: number = 16) {
  return {
    radius,
    widthSegments,
    heightSegments,
  };
}

export function latLngToVector3(lat: number, lng: number, radius: number = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return { x, y, z };
}

export function calculateGlobeRotation(mouseX: number, mouseY: number, sensitivity: number = 0.005) {
  return {
    rotationY: mouseX * sensitivity,
    rotationX: mouseY * sensitivity,
  };
}

export function createEmotionColorMapping() {
  return {
    nostalgia: '#a855f7', // purple-500
    love: '#f472b6',      // pink-400
    peace: '#22d3ee',     // cyan-400
    joy: '#facc15',       // yellow-400
    warmth: '#fb923c',    // orange-400
  };
}

export function animateMemoryPulse(time: number) {
  return {
    scale: 1 + Math.sin(time * 0.002) * 0.3,
    opacity: 0.5 + Math.sin(time * 0.001) * 0.3,
  };
}
