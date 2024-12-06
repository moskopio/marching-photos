#define STEP_BIAS 0.15
#define AA 1.0

vec4 raymarch(vec3 origin, vec3 direction) {
	float totalDistance = 0.0;
  vec3 color = vec3(0);
  
	for (int i = 0; i < 640; i++) {
		vec3 ray = origin + totalDistance * direction;
		vec4 closestElement = sdScene(ray);
    float colorSum = closestElement.r + closestElement.g + closestElement.b;
    
    totalDistance += closestElement.a * STEP_BIAS;
    color = closestElement.rgb;

		if (abs(closestElement.a) <= 0.0000001) break;
    if (abs(totalDistance) > 50.0 || abs(closestElement.a) > 50.0) break;
	}
  
	return vec4(color.rgb, totalDistance);
}

vec4 calculateSceneColor(in vec3 origin, in vec3 direction) {
  vec4 closestElement = raymarch(origin, direction);
  float distance = closestElement.a;
  vec3 position = origin + distance * direction;
  vec3 normal = calculateNormals(position);
  
  float colorSum = closestElement.r + closestElement.g + closestElement.b;
  vec3 elementColor = closestElement.rgb;
  elementColor = mix(elementColor, vec3(colorSum / 3.0), float(uColoring == 2.0));
  elementColor = mix(elementColor, vec3(1), float(uColoring == 3.0));
  elementColor = mix(elementColor, vec3(0), float(uColoring == 4.0));
  
  Scene scene = Scene(origin, origin, normal, elementColor);
  vec3 lightColor = calculateShading(scene);
  vec3 color = lightColor;
  color = mix(color, closestElement.rgb, float(uColoring == 1.0));
  
  float alpha = distance >= 50.0 ? 0.0 : 1.0;
  alpha = colorSum < 0.1 ? 0.0 : alpha;
  color = distance >= 50.0 ? vec3(0): color;
  
  return vec4(color, alpha);
}

void main() {
  vec2 uv = vec2(vPos.x * uAspectRatio, vPos.y);
  vec3 origin = vec3(0, 0, -3);
  vec3 direction = normalize(vec3(uv * 0.4, 1.0));
  direction.z -= uDolly;
  
  origin.yz *= rot2D(-uRotation.x);
  origin.xz *= rot2D(-uRotation.y);
  direction.yz *= rot2D(-uRotation.x);
  direction.xz *= rot2D(-uRotation.y);
  
  vec4 color = vec4(0);
  for (float i = 0.0; i < AA; i++)
  for (float j = 0.0; j < AA; j++) {
    vec3 aaRay = direction;
    aaRay.x += i * 0.001;
    aaRay.y += j * 0.001;
    color += calculateSceneColor(origin, aaRay);
  }
  color = color / (AA * AA);
  
  outColor = color;
}

