#define BOARD_SIZE 2.0

uniform sampler2D uImage;

float round(in float x) {
  return floor(x + 0.5);
}

vec2 round(in vec2 x) {
  return floor(x + vec2(0.5));
}

vec3 round(in vec3 x) {
  return floor(x + vec3(0.5));
}

// TODO: fix?
float constrain(in float x, in float min, in float max) {
  return x < max 
    ? x > min ? x : min
    : max;
}

float sampleSphere(in vec3 ray, in vec2 st, in float size) {
  vec4 texture = texture2D(uImage, st);
  float averange = 1.0 - (texture.x + texture.y + texture.z) / 3.0;
  
  float dotSize = (st.x + st.y) * 0.5 * size * 0.5;
  dotSize = averange * size * 0.5;
  
  return sdSphere(ray, vec3(0, 0, 0), dotSize);
}

float repeated(in vec3 ray, in float size) {
  vec3 repeatedRay = ray;
  float minConstrain = -1.0 - size / 2.0;
  float maxConstrain = 1.0 + size / 2.0;
  
  repeatedRay.x = ray.x - size * round(ray.x / size);
  repeatedRay.y = ray.y - size * round(ray.y / size);

  float sampleCount = 2.0 / size;
  // this is not working as expected, as it will value it based on pixel!
  vec2 id = ray.xy;
  // vec2 id = round(ray.xy / size);
  id.x = (id.x + 1.0) / 2.0;
  id.x = round((id.x) * sampleCount) / sampleCount;
  // id.x = round(id.x / size);
  id.y = 1.0 - (id.y + 1.0) / 2.0;
  id.y = round((id.y) * sampleCount) / sampleCount;
  
  return sampleSphere(repeatedRay, id, size);
}

float sdScene(vec3 ray) {
  return repeated(ray, 0.05);
}
