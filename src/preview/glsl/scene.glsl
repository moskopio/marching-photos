float sampleSphere(in vec3 ray, in vec2 st, in vec2 size) {
  vec4 texture = texture(uImage, st);
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

  vec2 st = ray.xy;
  st.x = (st.x + 1.0) / 2.0;
  st.x = round((st.x) * samples.x) / samples.x;
  st.y = 1.0 - (st.y + 1.0) / 2.0;
  st.y = round((st.y) * samples.y) / samples.y;
  
  return sampleSphere(repetition, st, size);
}

float sdScene(vec3 ray) {
  float ground = ray.y + 2.0;
  return min(ground, repeated(ray, vec2(40.0, 40.0)));
}
