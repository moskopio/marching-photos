float calculateShadows(in vec3 origin, in vec3 direction, float mint, float maxt, float w) {
  float res = 1.0;
  float t = mint;
  for(int i = 0; i < 128; i++) {
    float h = sdScene(origin + t * direction);
    res = min(res, h / (w * t));
    t += clamp(h, 0.005, 0.50);
    if( res < -1.0 || t > maxt ) break;
  }
  res = max(res, -1.0);
  return 0.25 * (1.0 + res) * (1.0 + res) * (2.0 - res);
}
