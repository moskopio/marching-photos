precision mediump float;

varying vec2 vPos;

uniform float uTime;
uniform float uAspectRatio;
uniform vec2 uResolution;
uniform vec2 uTrack;
uniform vec2 uRotation;
uniform float uDolly;

float dot2(in vec2 v) {
  return dot(v,v);
}

float dot2(in vec3 v) {
  return dot(v,v);
}

float ndot(in vec2 a, in vec2 b) {
  return a.x*b.x - a.y*b.y;
}

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

float sdSphere(vec3 ray, vec3 position, float size) {
  return length(ray - position) - size;
}

float sdBox(vec3 ray, vec3 position, vec3 bound) {
  vec3 box = abs(ray - position) - bound;
  return min(max(box.x,max(box.y,box.z)),0.0) + length(max(box,0.0));
}

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

float sdScene(vec3 ray) {
  float sphere = sdSphere(ray, vec3(sin(uTime / 1000.0) * 2.0, 0, 0), 0.65);
  
  vec3 boxRay = ray;
  boxRay.xy *= rot2D(uTime / 2000.0);
  float box = sdBox(boxRay * 0.9, vec3(0), vec3(0.5)) / 0.9; // scaling!
  float ground = ray.y + 0.99;
  // return smin(ground, smin(sphere, box, 2.0), 1.0);
  return smin(sphere, box, 2.0);
}

float raymarch(vec3 from, vec3 direction) {
	float totalDistance = 0.0;
	int steps = 0;
	for (int i = 0; i < 80; i++) {
		vec3 ray = from + totalDistance * direction;
		float distance = sdScene(ray);
		totalDistance += distance;
    
    steps = i;
		if (distance < 0.001) break;
    if (distance > 100.0) break;
    
    
	}
	// return totalDistance;
	// return 1.0 - float(steps) / float(80);
	return totalDistance / float(steps);
  // return float(steps) / float(80);
}

void main() {
  vec2 uv = vec2(vPos.x * uAspectRatio, vPos.y);
  
  // Initialization
  vec3 originRay = vec3(0, 0, -3);
  vec3 directionRay = normalize(vec3(uv * 0.5, 1.0));
  
  originRay.xy -= uTrack;
  directionRay.xy -= uTrack;
  directionRay.z -= uDolly;
  
  originRay.yz *= rot2D(uRotation.x);
  originRay.xz *= rot2D(uRotation.y);
  directionRay.yz *= rot2D(uRotation.x);
  directionRay.xz *= rot2D(uRotation.y);
  
  float distanceTraveled = raymarch(originRay, directionRay);
  
  vec3 color = vec3(distanceTraveled * .1) + vec3(uv, (uv.x + uv.y)/ 2.0); // color based on distance
  // vec3 color = vec3(distanceTraveled); //  + vec3(uv, 0); // color based on distance
  
  gl_FragColor = vec4(color, 1);
}

