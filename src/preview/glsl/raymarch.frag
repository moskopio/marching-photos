#define EPSILON 0.0001
#define SAMPLES 20.0

varying vec2 vPos;
varying vec2 vTexPos;

uniform float uTime;
uniform float uAspectRatio;
uniform vec2 uResolution;
uniform vec2 uTrack;
uniform vec2 uRotation;
uniform float uDolly;

uniform sampler2D uImage;

float round(in float x) {
  return floor(x + 0.5);
}

vec3 round(in vec3 x) {
  return floor(x + vec3(0.5));
}

float sampleSphere(vec3 ray, vec2 st) {
  vec4 texture = texture2D(uImage, st);
  float averange = (texture.x + texture.y + texture.z) / 3.0;
  
  return sdSphere(ray, vec3(0, 0, 0), 0.1);
}

// float repeat(vec3 p, float s )
// {
//     vec3 id = round(p / s);
//     vec2 r = p - s * id;
//     return sdf(r, id);
// }

float repeated(in vec3 ray) {
  float displacement = sin(4.0 * ray.x + 0.1 * uTime / 500.0) * sin(5.0 * ray.y + 0.1 * uTime / 400.0) * sin(6.0 * ray.z + 0.1 * uTime / 300.0) * 0.20;
  displacement = sin(4.0 * ray.x) * sin(5.0 * ray.y) * sin(6.0 * ray.z) * 0.20;
  
  
  
  ray.y += uTime * 0.0001;
  ray.x += sin(uTime * 0.0002);
  ray.z += sin(uTime * 0.0003);
  vec3 id = round(ray.xyz / 1.1); // * 2.0;
  vec3 gray = ray - 1.1 * id;
  
  // gray = mod(ray, 1.0) + 0.5;
  // if (gray.x > -2.5 && gray.x < 2.5) {
  //   gray.x = gray.x - floor(ray.x + 0.5);
  // }
  // if (gray.y > -2.5 && gray.y < 2.5) {
  //   gray.y = gray.y - floor(gray.y + 0.5);
  // }
  
  vec2 uv = vec2((gray.x + 2.5) / 5.0, (gray.y + 2.5) / 5.0);
  // ray.x = ray.x - floor(ray.x + 0.5);

  // float sphere = sdSphere(ray, vec3(sin(uTime / 1000.0) * 2.0, 0, 0), 0.65) + displacement;
  return sampleSphere(gray, uv); // + displacement;
  // return sdSphere(gray, vec3(0, 0, 0), 0.5); // + displacement;
}

float sdScene(vec3 ray) {
  float displacement = sin(4.0 * ray.x) * sin(5.0 * ray.y) * sin(6.0 * ray.z) * 0.20;
  
  float distance = 100.0;
  
  // float x = ( 0.0 / SAMPLES) * 6.0 - 3.0;
  // // sdBox(ray, vec3(-2.0,0.3,0.25),vec3(0.3,0.3,1.0));
  // float boundDistance = sdBox(ray, vec3(x,-3.0,-1.0),vec3(6.0 / SAMPLES, 6.0, 1));
    
  // distance = min(boundDistance, distance);
    
  // instead I need to use domain repetition!
  // for (float i = 0.0; i < (SAMPLES / 1.0); i++) {
  //   float x = (i * 1.0 / SAMPLES) * 6.0 - 3.0;
  //   float boundDistance = sdBox(ray, vec3(x,-3.0,0), vec3(3.0 / SAMPLES, 3.0, 6));
    
  //   if (distance < boundDistance) continue;
  //   // distance = min(boundDistance, distance);
    
  //   for (float j = 0.0; j < SAMPLES; j++) {
  //     vec2 st = vec2(i / SAMPLES, 1.0 -j / SAMPLES);
      
  //     vec4 texture = texture2D(uImage, st);
  //     float averange = (texture.x + texture.y + texture.z) / 3.0;
  //     if (averange < 0.3) continue;
      
  //     averange /= (SAMPLES / 2.0);
      
  //     // I need to center it somehow!
  //     vec3 pos = vec3(st, (SAMPLES / 10.0) - averange * (SAMPLES / 2.0)); //(st * 2.0 - vec2(1)) * 4.0;
  //     pos.x = pos.x * 6.0 - 3.0;
  //     pos.y = 3.0 - pos.y * 6.0;
      
  //     float sphereDistance = sdSphere(ray, vec3(pos), averange);
  //     distance = smin(distance, sphereDistance, 0.2 - sin(uTime / 1000.0) * 0.2);
  //     // distance = min(distance, sphereDistance);
  //     if (distance < 0.01) return distance;
  //   }
  // }
  
  
  
  
    // return distance;
  
  vec3 boxRay = ray;
  boxRay.xy *= rot2D(uTime / 2000.0);
  float box = sdBox(boxRay * 0.9, vec3(0), vec3(0.5)) / 0.9; // scaling!
  
  
  float sphere = sdSphere(ray, vec3(sin(uTime / 1000.0) * 2.0, 0, 0), 0.65) + displacement;
  
  // vec3 boxRay = ray;
  // boxRay.xy *= rot2D(uTime / 2000.0);
  // float box = sdBox(boxRay * 0.9, vec3(0), vec3(0.5)) / 0.9; // scaling!
  float ground = ray.y + 0.99;
  // return smin(ground, smin(sphere, box, 2.0), 0.75);
  return repeated(ray);
  // return smin(repeated(ray), box, 2.0);
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
    if (totalDistance > 100.0) break;
	}
  
	return totalDistance;
}

vec3 calculateNormals(in vec3 p) {
    const vec2 k = vec2(1,-1);
    vec3 part0 = k.xyy * sdScene(p + k.xyy * EPSILON);
    vec3 part1 = k.yyx * sdScene(p + k.yyx * EPSILON);
    vec3 part2 = k.yxy * sdScene(p + k.yxy * EPSILON);
    vec3 part3 = k.xxx * sdScene(p + k.xxx * EPSILON);
    return normalize(part0 + part1 + part2 + part3);
}

float softshadow(in vec3 ro, in vec3 rd, float mint, float maxt, float w) {
  float res = 1.0;
  float t = mint;
  for(int i = 0; i < 128; i++) {
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
  vec3 direction = normalize(vec3(uv, 1.0));
  
  origin.xy -= uTrack;
  direction.xy -= uTrack;
  direction.z -= uDolly;
  
  origin.yz *= rot2D(uRotation.x);
  origin.xz *= rot2D(uRotation.y);
  direction.yz *= rot2D(uRotation.x);
  direction.xz *= rot2D(uRotation.y);
  
  float distance = raymarch(origin, direction);
  vec3 position = origin + distance * direction;
  vec3 normal = calculateNormals(position);
  
  Light light = Light(
    vec3(sin(uTime / 2000.0), 1, cos(uTime / 2000.0)), 
    // origin, 
    vec3(0.1, 0, 0.1), 
    vec3(0, 0.8, 0.8), 
    vec3(1), 
    vec3(1, 0, 0), 
    20.0);
  ShadingCommon common = ShadingCommon(position, normal, origin);
  
  vec3 lightColor = calculateLambertShading(common, light);
  float shadow = softshadow(position, light.position, 0.01, 1.0, 0.1);
  float occlusion = calcAO(position, normal);
  
  vec3 color = lightColor * shadow * occlusion;
  // vec3 color = vec3(distance);
  float alpha = distance >= 100.0 ? 0.0 : 1.0;
  
  vec4 texture = texture2D(uImage, vTexPos);
  vec3 averageTexture = vec3((texture.x + texture.y + texture.z) / 3.0);
  // gl_FragColor = vec4(averageTexture, 1.0);
  gl_FragColor = vec4(color, alpha);
  
  // gl_FragColor = alpha > 0.0 ? vec4(color, alpha) : texture;
}

