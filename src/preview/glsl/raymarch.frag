precision mediump float;

#define EPSILON 0.0001

varying vec2 vPos;

uniform float uTime;
uniform float uAspectRatio;
uniform vec2 uResolution;
uniform vec2 uTrack;
uniform vec2 uRotation;
uniform float uDolly;

float sdScene(vec3 ray) {
  
  float displacement = sin(4.0 * ray.x) * sin(5.0 * ray.y) * sin(6.0 * ray.z) * 0.20;
  float sphere = sdSphere(ray, vec3(sin(uTime / 1000.0) * 2.0, 0, 0), 0.65) + displacement;
  
  vec3 boxRay = ray;
  boxRay.xy *= rot2D(uTime / 2000.0);
  float box = sdBox(boxRay * 0.9, vec3(0), vec3(0.5)) / 0.9; // scaling!
  float ground = ray.y + 0.99;
  return smin(ground, smin(sphere, box, 2.0), 0.75);
  // return smin(sphere, box, 2.0);
}

float raymarch(vec3 from, vec3 direction) {
	float totalDistance = 0.0;
	int steps = 0;
	for (int i = 0; i < 64; i++) {
		vec3 ray = from + totalDistance * direction;
		float stepDistance = sdScene(ray);
		totalDistance += stepDistance;
    
    steps = i;
		if (stepDistance < 0.001) break;
    if (stepDistance > 100.0) break;
	}
  
	return totalDistance;
}

vec3 estimateNormal(in vec3 p) {
  return normalize(vec3(
    sdScene(vec3(p.x + EPSILON, p.y, p.z)) - sdScene(vec3(p.x - EPSILON, p.y, p.z)),
    sdScene(vec3(p.x, p.y + EPSILON, p.z)) - sdScene(vec3(p.x, p.y - EPSILON, p.z)),
    sdScene(vec3(p.x, p.y, p.z  + EPSILON)) - sdScene(vec3(p.x, p.y, p.z - EPSILON))
  ));
}

float softshadow(in vec3 ro, in vec3 rd, float mint, float maxt, float w) {
  float res = 1.0;
  float t = mint;
  for(int i = 0; i < 256; i++ ) {
    float h = sdScene(ro + t * rd);
    res = min(res, h / (w * t));
    t += clamp(h, 0.005, 0.50);
    if( res < -1.0 || t > maxt ) break;
  }
  res = max(res, -1.0);
  return 0.25 * (1.0 + res) * (1.0 + res) * (2.0 - res);
}

float calcAO(in vec3 pos, in vec3 nor) {
	float occ = 0.0;
  float sca = 1.0;
  for( int i=0; i<5; i++ ) {
    float h = 0.01 + 0.12*float(i)/4.0;
    float d = sdScene( pos + h*nor );
    occ += (h-d)*sca;
    sca *= 0.95;
    if( occ>0.35 ) break;
  }
  return clamp( 1.0 - 3.0*occ, 0.0, 1.0 ) * (0.5+0.5*nor.y);
}


void main() {
  vec2 uv = vec2(vPos.x * uAspectRatio, vPos.y);
  
  // Initialization
  vec3 origin = vec3(0, 0, -3);
  vec3 direction = normalize(vec3(uv * 0.5, 1.0));
  
  origin.xy -= uTrack;
  direction.xy -= uTrack;
  direction.z -= uDolly;
  
  origin.yz *= rot2D(uRotation.x);
  origin.xz *= rot2D(uRotation.y);
  direction.yz *= rot2D(uRotation.x);
  direction.xz *= rot2D(uRotation.y);
  
  float distance = raymarch(origin, direction);
  vec3 position = origin + distance * direction;
  vec3 normal = estimateNormal(position);
  
  Light light = Light(vec3(sin(uTime / 2000.0), 1, cos(uTime / 2000.0)), vec3(0.1, 0, 0.1), vec3(0, 0.8, 0.8), vec3(1), vec3(1, 0, 0), 20.0);
  ShadingCommon common = ShadingCommon(position, normal, origin);
  
  vec3 lightColor = calculateLambertShading(common, light);
  float shadow = softshadow(position, light.position, 0.01, 1.0, 0.1);
  float occlusion = calcAO(position, normal);
  
  vec3 color = lightColor * shadow * occlusion;
  float alpha = distance >= 100.0 ? 0.0: 1.0; 
  
  gl_FragColor = vec4(color, alpha);
}

