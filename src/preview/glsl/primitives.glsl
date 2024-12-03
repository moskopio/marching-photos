float sdSphere(vec3 ray, vec3 position, float size) {
  return length(ray - position) - size;
}

float sdBox(vec3 ray, vec3 position, vec3 bound) {
  vec3 box = abs(ray - position) - bound;
  return min(max(box.x,max(box.y,box.z)),0.0) + length(max(box,0.0));
}
