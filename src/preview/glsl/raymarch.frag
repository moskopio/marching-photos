#define STEP_BIAS 0.15
#define AA 1.0
#define AA_STEP 0.001
#define FOV 0.4

#define MIN_SIZE     0.0001
#define MIN_ALPHA    0.1
#define MIN_COLOR    0.1
#define MAX_DISTANCE 50.0
#define MIN_DISTANCE 0.0001

Result raymarch(vec3 origin, vec3 direction) {
  float totalDistance = 0.0;
  Result element = Result(vec4(0.0), 0.0, 0.0);
  
  // Close proximity of domain repetition requires a lot of steps, otherwise it will be glitchy
  for (int i = 0; i < 640; i++) {
  vec3 ray = origin + totalDistance * direction;
    Result closestElement = sampleScene(ray);
    
    // STEP_BIAS is necessary for when elements appear in front of other domains, as without it
    // distance can be misscalculated.
    totalDistance += closestElement.distance * STEP_BIAS;
    
    element = Result(closestElement.color, closestElement.size, totalDistance);
    
    if (abs(closestElement.distance) <= MIN_DISTANCE) break;
    if (abs(totalDistance) >= MAX_DISTANCE) break;
    if (abs(closestElement.distance) >= MAX_DISTANCE) break;
  }
  
  return element;
}

vec4 calculateSceneColor(in vec3 origin, in vec3 direction) {
  Result element = raymarch(origin, direction);
  vec3 position = origin + element.distance * direction;
  vec3 normal = calculateNormals(position);
  
  float colorSum = element.color.r + element.color.g + element.color.b;
  vec3 color = element.color.rgb;
  color = mix(color, vec3(colorSum / 3.0), float(uColoring == 2.0));
  color = mix(color, vec3(1), float(uColoring == 3.0));
  color = mix(color, vec3(0), float(uColoring == 4.0));
  
  Scene scene = Scene(origin, origin, normal, color);
  color = calculateShading(scene);
  color = mix(color, element.color.rgb, float(uColoring == 1.0));
  
  // blackening too far elements, too small ones, and not visible ones
  color = mix(color, vec3(0.0), float(element.distance >= MAX_DISTANCE));
  color = mix(color, vec3(0.0), float(element.color.a <= MIN_ALPHA));
  color = mix(color, vec3(0.0), float(element.size < MIN_SIZE));
  color = mix(color, vec3(0.0), float(colorSum < MIN_COLOR));
  
  // hidding (naivly) elements too small or not visible
  float alpha = mix(element.color.a, 0.0, float(element.distance >= MAX_DISTANCE));
  alpha = mix(alpha, 0.0, float(element.color.a <= MIN_ALPHA));
  alpha = mix(alpha, 0.0, float(element.size < MIN_SIZE));
  alpha = mix(alpha, 0.0, float(colorSum < MIN_COLOR));
  
  return vec4(color, alpha);
}

void main() {
  vec2 uv = vec2(vPos.x * uAspectRatio, vPos.y);
  vec3 origin = vec3(0, 0, -3);
  vec3 direction = normalize(vec3(uv * FOV, 1.0));
  direction.z -= uDolly;
  
  origin.yz *= rot2D(-uRotation.x);
  origin.xz *= rot2D(-uRotation.y);
  direction.yz *= rot2D(-uRotation.x);
  direction.xz *= rot2D(-uRotation.y);
  
  vec4 color = vec4(0);
  for (float i = 0.0; i < AA; i++)
  for (float j = 0.0; j < AA; j++) {
    vec3 aaRay = direction;
    aaRay.x += i * AA_STEP;
    aaRay.y += j * AA_STEP;
    color += calculateSceneColor(origin, aaRay);
  }
  color = color / (AA * AA);
  
  outColor = color;
}
