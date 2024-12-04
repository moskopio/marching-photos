in vec2 vPos;
in vec2 vTexPos;
out vec4 outColor;

vec4 raymarch(vec3 origin, vec3 direction) {
	float totalDistance = 0.0;
  vec3 color = vec3(0);
  
	for (int i = 0; i < 64; i++) {
		vec3 ray = origin + totalDistance * direction;
		vec4 closestElement = sdScene(ray);
		totalDistance += closestElement.a;
    color = closestElement.rgb;
    
		if (abs(closestElement.a) <= 0.001) break;
    if (abs(totalDistance) > 50.0 || abs(closestElement.a) > 50.0) break;
	}
  
	return vec4(color.rgb, totalDistance);
}

vec4 calculateSceneColor(in vec3 origin, in vec3 direction, in Light light) {
  vec4 closestElement = raymarch(origin, direction);
  float distance = closestElement.a;
  vec3 position = origin + distance * direction;
  vec3 lightPosition = light.position;
  vec3 normal = calculateNormals(position);
  
  Light newLight = Light(origin, closestElement.rgb, vec3(0.8), vec3(1), vec3(1), 20.0);
  ShadingCommon shadingCommon = ShadingCommon(position, normal, origin);
  Scene scene = Scene(newLight, shadingCommon);
  
  vec3 lightColor = calculateLambertShading(scene);
  float shadow = calculateShadows(position, lightPosition, 0.01, 1.0, 0.1);
  float occlusion = calculateAO(position, normal);
  
  vec3 color = lightColor * shadow * occlusion;
  color = closestElement.rgb;
  float alpha = distance >= 50.0 ? 0.0 : 1.0;
  color = distance >= 50.0 ? vec3(0): color;
  
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
  
  Light light = Light(
    // vec3(sin(uTime / 2000.0), 1, cos(uTime / 2000.0)), 
    origin, 
    vec3(0.1, 0.1, 0.1), 
    vec3(0.8, 0.8, 0.8), 
    vec3(1), 
    vec3(1, 1, 1), 
    20.0);
  vec4 color = calculateSceneColor(origin, direction, light);
  
  outColor = color;
}

