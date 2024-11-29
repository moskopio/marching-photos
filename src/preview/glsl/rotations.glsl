mat2 rot2D(in float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

// Rodrigues' rotation formula
vec3 rot3D(in vec3 p, in vec3 axis, in float angle) {
  return mix(dot(axis, p) * axis, p, cos(angle)) + cross(axis, p) * sin(angle);
}

 vec3 qTransform(in vec4 q, in vec3 v) {
	return v + 2.0 * cross(cross(v, q.xyz) + q.w * v, q.xyz);
} 
