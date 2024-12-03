in vec2 vPos;
in vec2 vTexPos;

out vec4 outColor;

float raymarch(vec3 origin, vec3 direction) {
	float totalDistance = 0.0;
	int steps = 0;
  
	for (int i = 0; i < 64; i++) {
		vec3 ray = origin + totalDistance * direction;
		float stepDistance = sdScene(ray);
		totalDistance += stepDistance;
    
    steps = i;
		if (stepDistance < 0.001) break;
    if (totalDistance > 100.0) break;
	}
  
	return totalDistance;
}

vec4 calculateSceneColor(in vec3 origin, in vec3 direction, in Scene scene) {
  float distance = raymarch(origin, direction);
  vec3 position = origin + distance * direction;
  vec3 normal = calculateNormals(position);
  
  
  vec3 lightColor = calculateLambertShading(scene);
  float shadow = calculateShadows(position, scene.light.position, 0.01, 1.0, 0.1);
  float occlusion = calculateAO(position, normal);
  
  vec3 color = lightColor * shadow * occlusion;
   
  float fogAmount = 1.0 - exp(-(distance - 8.0) * (1.0 / 80.0));
   float alpha = distance >= 100.0 ? 0.0 : 1.0;
  alpha = mix(alpha, 0.0, fogAmount);
 
  
  return vec4(color, alpha);
}

void main() {
  vec2 uv = vec2(vPos.x * uAspectRatio, vPos.y);
  // Initialization
  vec3 origin = vec3(0, 0, -3);
  vec3 direction = normalize(vec3(uv * 0.25, 1.0));
  
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
    // vec3(sin(uTime / 2000.0), 1, cos(uTime / 2000.0)), 
    origin, 
    vec3(0.1, 0.1, 0.1), 
    vec3(0, 0.8, 0.8), 
    vec3(1), 
    vec3(1, 1, 1), 
    20.0);
  ShadingCommon shadingCommon = ShadingCommon(position, normal, origin);
  Scene scene = Scene(light, shadingCommon);
  
  vec4 color = calculateSceneColor(origin, direction, scene);
  
  outColor = color;
}

