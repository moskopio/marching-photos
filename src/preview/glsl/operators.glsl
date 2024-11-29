float opUnion(in float d0, in float d1) {
  return min(d0, d1);
}

float opSubtraction(in float d0, in float d1) {
  return max(-d0, d1);
}

float opIntersection(in float d0, in float d1) {
  return max(d0, d1);
}

float opSmoothUnion(in float d0, in float d1, in float k) {
  float h = clamp(0.5 + 0.5 * (d1 - d0) / k, 0.0, 1.0 );
  return mix(d1, d0, h) - k*h*(1.0 - h);
}

float opSmoothSubtraction(in float d0, in float d1, in float k) {
  float h = clamp(0.5 - 0.5 * (d1 + d0) / k, 0.0, 1.0);
  return mix(d1, -d0, h) + k*h*(1.0 - h);
}

float opSmoothIntersection( in float d0, float d1, in float k) {
  float h = clamp(0.5 - 0.5*(d1 - d0) / k, 0.0, 1.0);
  return mix(d1, d0, h) + k*h*(1.0 - h);
}

float smin(in float d0, in float d1, in float k) {
  float h = max(k - abs(d0-d1), 0.0) / k;
  return min(d0, d1) - h*h*h*k*(1.0 / 6.0);
}
