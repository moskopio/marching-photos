#define EPSILON 0.0001

vec3 calculateNormals(in vec3 p) {
  const vec2 k = vec2(1, -1);
  
  vec3 part0 = k.xyy * sampleScene(p + k.xyy * EPSILON).distance;
  vec3 part1 = k.yyx * sampleScene(p + k.yyx * EPSILON).distance;
  vec3 part2 = k.yxy * sampleScene(p + k.yxy * EPSILON).distance;
  vec3 part3 = k.xxx * sampleScene(p + k.xxx * EPSILON).distance;
  
  return normalize(part0 + part1 + part2 + part3);
}
