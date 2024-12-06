float random(in float seed) {
  return fract(sin(seed * 65.4321) * 1234.5678);
}

vec4 sampleSphere(in vec3 ray, in vec2 st, in vec2 size) {
  vec4 texture = texture(uImage, st);
  vec3 color = texture.rgb;
  float averange = (texture.x + texture.y + texture.z) / 3.0;
  float scale = min(size.x, size.y) * 0.5;
  float sphereSize = 0.0001 + averange * scale;
  
  float push = uPush * averange;
  
  float sphere = sdSphere(ray, vec3(0, 0, -push), sphereSize);
  float torus = sdTorus(ray, vec3(0,0,-push), vec2(sphereSize * 0.5, sphereSize * 0.3));
  float octa = sdOctahedron(ray, vec3(0,0,-push), sphereSize);
  float box = sdBox(ray, vec3(0,0, -push), vec3(sphereSize));
  
  float distance = octa;
  return vec4(color, distance);
}

vec4 repeated(in vec3 ray, in vec2 samples) {
  vec2 size = 2.0 / samples;
  vec2 constrains = samples / 2.0;
  constrains.x *= uImgAspectRatio;
  
  vec3 repetition = ray;
  repetition.x = ray.x - size.x * clamp(round(ray.x / size.x), -constrains.x, constrains.x);
  repetition.y = ray.y - size.y * clamp(round(ray.y / size.y), -constrains.y, constrains.y);

  vec2 st = ray.xy;
  // fixing issues with st not matching samples count, and cutting them in parts
  st.x = (st.x + uImgAspectRatio) / 2.0;
  st.x = round((st.x) * samples.x) / samples.x;
  st.x /= uImgAspectRatio;
  st.y = 1.0 - (st.y + 1.0) / 2.0;
  st.y = round((st.y) * samples.y) / samples.y;
  
  return sampleSphere(repetition, st, size);
}

vec4 sdScene(in vec3 ray) {
  vec2 samples = uSamples;
  samples.x /= uImgAspectRatio;
  return repeated(ray, samples);
}
