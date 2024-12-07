float sampleSphere(vec3 ray, vec3 position, float size) {
  vec3 p = ray - position;
  
  return length(p) - size;
}

float sampleBox(vec3 ray, vec3 position, vec3 bound) {
  vec3 box = abs(ray - position) - bound;
  
  return min(max(box.x,max(box.y, box.z)),0.0) + length(max(box,0.0));
}

float sampleTorus(vec3 ray, vec3 position, vec2 size) {
  vec3 p = ray - position;
  vec2 q = vec2(length(p.xy) - size.x, p.z);
  
  return length(q) - size.y;
}

float sampleOctahedron(vec3 ray, vec3 position, float size) {
  vec3 p = ray - position;
  p = abs(p);
  
  return (p.x + p.y + p.z - size) * 0.57735027;
}
