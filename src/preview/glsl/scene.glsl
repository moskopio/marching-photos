#define BOX_SCALE   0.8
#define TORUS_HOLE  0.5
#define TORUS_OUTER 0.25

#define DOMAIN_SCALE 0.5

#define SHAPE_TORUS 1.0
#define SHAPE_OCTA  2.0
#define SHAPE_BOX   3.0

#define IGNORED_SIZE 0.01

Result sampleElement(in vec3 ray, in vec2 st, in vec2 domainSize, in vec2 samples, in vec3 fullRay) {
  vec4 texture = texture(uImage, st);
  float sampleAverange = (texture.x + texture.y + texture.z) / 3.0;
  float averange = mix(sampleAverange, 1.0 - sampleAverange, bool(uFlags & FLAG_SCALING_REVERSE));
  
  float scale = min(domainSize.x, domainSize.y) * DOMAIN_SCALE;
  float noScaling = float(bool(uFlags & FLAG_SCALING_DISABLED) && sampleAverange > IGNORED_SIZE);
  float size = averange * scale;
  size = mix(size, scale, noScaling);
  
  float push = uPush * averange;
  push = mix(push, 0.0,   bool(uFlags & FLAG_PUSH_DISABLED));
  vec3 position = vec3(0.0, 0.0, -push);
  
  float sphere = sampleSphere(ray, position, size);
  float torus = sampleTorus(ray, position, vec2(size * TORUS_HOLE, size * TORUS_OUTER));
  float octa = sampleOctahedron(ray, position, size);
  // Boxes glitch down when full size, so they need to be scaled down
  float box = sampleBox(ray, position, vec3(size * BOX_SCALE));
  
  float distance = mix(sphere, torus, uShape == SHAPE_TORUS);
  distance = mix(distance, octa, uShape == SHAPE_OCTA);
  distance = mix(distance, box,  uShape == SHAPE_BOX);
  
  return Result(texture, size, distance);
}

Result repeated(in vec3 ray, in vec2 samples) {
  vec2 domainSize = 2.0 / samples;
  vec2 constrains = samples / 2.0;
  constrains.x *= uImgAspectRatio;
  
  vec3 repetition = ray;
  repetition.x = ray.x - domainSize.x * clamp(round(ray.x / domainSize.x), -constrains.x, constrains.x);
  repetition.y = ray.y - domainSize.y * clamp(round(ray.y / domainSize.y), -constrains.y, constrains.y);
  
  vec2 st = ray.xy;
  // fixing issues with st division not matching samples count and resulting in cutting samples in parts
  st.x = (st.x + uImgAspectRatio) / 2.0;
  st.x = round((st.x) * samples.x) / samples.x;
  st.x /= uImgAspectRatio;
  
  st.y = 1.0 - (st.y + 1.0) / 2.0;
  st.y = round((st.y) * samples.y) / samples.y;
  
  return sampleElement(repetition, st, domainSize, samples, ray);
}

Result sampleScene(in vec3 ray) {
  vec2 samples = uSamples;
  // adjusting samples to match aspect ratio to avoid cutting them in parts
  samples.x /= uImgAspectRatio;
  return repeated(ray, samples);
}
