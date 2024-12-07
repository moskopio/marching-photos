#define BOX_SCALE    0.8
#define TORUS_HOLE   0.4
#define TORUS_OUTER  0.3

#define DOMAIN_SCALE 0.5

Result sampleElement(in vec3 ray, in vec2 st, in vec2 domainSize) {
  vec4 texture = texture(uImage, st);
  float averange = (texture.x + texture.y + texture.z) / 3.0;
  float scale = min(domainSize.x, domainSize.y) * DOMAIN_SCALE;
  // float size = averange * scale * texture.a;
  float size = averange * scale;
  
  float push = uPush * averange;
  vec3 position = vec3(0, 0, -push);
  
  float sphere = sampleSphere(ray, position, size);
  float torus = sampleTorus(ray, position, vec2(size * TORUS_HOLE, size * TORUS_OUTER));
  float octa = sampleOctahedron(ray, position, size);
  // Boxes glitch down when full size, so they need to be scaled down
  float box = sampleBox(ray, position, vec3(size * BOX_SCALE));
  
  float distance = mix(sphere, torus, float(uShape == 1.0));
  distance = mix(distance, octa, float(uShape == 2.0));
  distance = mix(distance, box,  float(uShape == 3.0));
  
  Result result = Result(texture, size, distance);
  return result;
}

Result repeated(in vec3 ray, in vec2 samples) {
  vec2 domainSize = 2.0 / samples;
  vec2 constrains = samples / 2.0;
  constrains.x *= uImgAspectRatio;
  
  vec3 repetition = ray;
  repetition.x = ray.x - domainSize.x * clamp(round(ray.x / domainSize.x), -constrains.x, constrains.x);
  repetition.y = ray.y - domainSize.y * clamp(round(ray.y / domainSize.y), -constrains.y, constrains.y);
  
  vec2 st = ray.xy;
  // fixing issues with st not matching samples count and resulting in cutting them in parts
  st.x = (st.x + uImgAspectRatio) / 2.0;
  st.x = round((st.x) * samples.x) / samples.x;
  st.x /= uImgAspectRatio;
  
  st.y = 1.0 - (st.y + 1.0) / 2.0;
  st.y = round((st.y) * samples.y) / samples.y;
  
  return sampleElement(repetition, st, domainSize);
}

Result sampleScene(in vec3 ray) {
  vec2 samples = uSamples;
  // adjusting samples to match aspect ratio, to avoid cutting them in half
  samples.x /= uImgAspectRatio;
  return repeated(ray, samples);
}
