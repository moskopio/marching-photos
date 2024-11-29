float dot2(in vec2 v) {
  return dot(v,v);
}

float dot2(in vec3 v) {
  return dot(v,v);
}

float ndot(in vec2 a, in vec2 b) {
  return a.x*b.x - a.y*b.y;
}

float sdSphere(vec3 ray, vec3 position, float size) {
  return length(ray - position) - size;
}

float sdBox(vec3 ray, vec3 position, vec3 bound) {
  vec3 box = abs(ray - position) - bound;
  return min(max(box.x,max(box.y,box.z)),0.0) + length(max(box,0.0));
}

