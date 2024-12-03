float calculateAO(in vec3 position, in vec3 normal) {
	float occ = 0.0;
  float sca = 1.0;
  for( float i= 0.0; i < 5.0; i++) {
    float h = 0.01 + 0.12 * i / 4.0;
    float d = sdScene(position + h * normal);
    occ += (h - d) * sca;
    sca *= 0.95;
    if( occ > 0.35 ) break;
  }
  return clamp(1.0 - 3.0 * occ, 0.0, 1.0) * (0.5 + 0.5 * normal.y);
}
