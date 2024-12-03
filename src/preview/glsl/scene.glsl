#define BOARD_SIZE 1.0

uniform sampler2D uImage;

float round(in float x) {
  return floor(x + 0.5);
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
  // vec4 texture = texture2D(uImage, st);
  // float averange = (texture.x + texture.y + texture.z) / 3.0;
  
  return sdSphere(ray, vec3(0, 0, 0), st.x * size * 0.1);
}

float repeated(in vec3 ray, in float size) {
  vec3 id = ray;
  
  // constraining to board should take aspect ratio of the displayed picture into account!
  id.x = constrain(round(id.x / size), -BOARD_SIZE / size, BOARD_SIZE / size);
  id.y = constrain(round(id.y / size), -BOARD_SIZE / size, BOARD_SIZE / size);
  id.z = constrain(round(id.z / size), -BOARD_SIZE / size, BOARD_SIZE / size);
  vec3 repeatedRay = ray - size * id;
  
  // id needs to be normalized!
  id.x = (id.x / 2.0 + BOARD_SIZE / size) * size;
  id.y = (id.y / 2.0 + BOARD_SIZE / size) * size;
  id.z = (id.z / 2.0 + BOARD_SIZE / size) * size;
  return sampleSphere(repeatedRay, id.zz, size);
}

float sdScene(vec3 ray) {
  return repeated(ray, 0.5);
}
