vec4 sampleSphere(in vec3 ray, in vec3 st, in vec3 size) {
  vec4 texture = texture(uImage, st.xy);
  vec3 color = texture.rgb;
  float averange = (texture.x + texture.y + texture.z) / 3.0;
  float scale = min(size.x, size.y) * 0.5;
  float sphereSize = averange * scale;;
  
  float distance = sdSphere(ray, vec3(0, 0, 0), sphereSize);
  
  return vec4(color, distance);
}


vec4 repeated(in vec3 ray, in vec3 samples) {
  vec3 size = 2.0 / samples;
  vec3 constrains = samples / 2.0;
  
  vec3 repetition = ray;
  repetition.x = ray.x - size.x * clamp(round(ray.x / size.x), -constrains.x, constrains.x);
  repetition.y = ray.y - size.y * clamp(round(ray.y / size.y), -constrains.y, constrains.y);
  // repetition.z = ray.z - size.z * clamp(round(ray.z / size.z), -constrains.z, constrains.z);

  vec3 st = ray.xyz;
  st.x = (st.x + 1.0) / 2.0;
  st.x = round((st.x) * samples.x) / samples.x;
  st.y = 1.0 - (st.y + 1.0) / 2.0;
  st.y = round((st.y) * samples.y) / samples.y;
  // st.z = (st.z + 1.0) / 2.0;
  // st.z = round((st.z) * samples.z) / samples.z;
  
  return sampleSphere(repetition, st, size);
}

vec4 sdScene(vec3 ray) {
  vec3 samples = vec3(40, 40, 4);
  return repeated(ray, samples); 
}
