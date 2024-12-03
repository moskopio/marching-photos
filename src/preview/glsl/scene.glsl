
float round(in float x) {
  return floor(x + 0.5);
}

vec2 round(in vec2 x) {
  return floor(x + vec2(0.5));
}

vec3 round(in vec3 x) {
  return floor(x + vec3(0.5));
}

float sampleSphere(in vec3 ray, in vec2 st, in vec2 size) {
  vec4 texture = texture2D(uImage, st);
  float averange = 1.0 - (texture.x + texture.y + texture.z) / 3.0;
  float scale = min(size.x, size.y) * 0.5;
  
  float dotSize = (st.x + st.y) * 0.5 * scale;
  dotSize = averange * scale;
  
  return sdSphere(ray, vec3(0, 0, 0), dotSize);
}


float repeated(in vec3 ray, in vec2 samples) {
  vec2 size = 2.0 / samples;
  vec2 constrains = samples / 2.0;
  
  vec3 repetition = ray;
  repetition.x = ray.x - size.x * clamp(round(ray.x / size.x), -constrains.x, constrains.x);
  repetition.y = ray.y - size.y * clamp(round(ray.y / size.y), -constrains.y, constrains.y);

  vec2 id = ray.xy;
  id.x = (id.x + 1.0) / 2.0;
  id.x = round((id.x) * samples.x) / samples.x;
  id.y = 1.0 - (id.y + 1.0) / 2.0;
  id.y = round((id.y) * samples.y) / samples.y;
  
  return sampleSphere(repetition, id, size);
}

float sdScene(vec3 ray) {
  return repeated(ray, vec2(20.0, 20.0));
}
