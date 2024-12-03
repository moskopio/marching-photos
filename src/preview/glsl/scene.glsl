#define BOARD_SIZE 2.0

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
  vec4 texture = texture2D(uImage, st);
  float averange = (texture.x + texture.y + texture.z) / 3.0;
  
  return sdSphere(ray, vec3(0, 0, 0), averange * size * 0.5);
}

float repeated(in vec3 ray, in float size) {
  vec3 repeatedRay = ray;
  
  // for a board of size BOARD_SIZE
  // divide it into 10 equal parts!
  
  // vec2 r = p - s*round(p/s);
  
  float minConstrain = -1.0 - size / 2.0;
  float maxConstrain = 1.0 + size / 2.0;
  if (ray.x > minConstrain && ray.x < maxConstrain) {
    repeatedRay.x = ray.x - size * round(ray.x / size);
  }
  if (ray.y > minConstrain && ray.y < maxConstrain) {
    repeatedRay.y = ray.y - size * round(ray.y / size);
  }
  
  vec2 id = ray.xy;
  id.x = (id.x + 1.0) / 2.0;
  id.y = 1.0 - (id.y + 1.0) / 2.0;
  // id.x = ray.x - 0.5 * round(ray.x / 0.5);
  
  
  // constraining to board should take aspect ratio of the displayed picture into account!
  // id.x = constrain(round(id.x / size), -BOARD_SIZE / size, BOARD_SIZE / size);
  // id.y = constrain(round(id.y / size), -BOARD_SIZE / size, BOARD_SIZE / size);
  // vec3 repeatedRay = ray - size * id;
  
  // id needs to be normalized!
  // id.x = (id.x / 2.0 + BOARD_SIZE / size) * size;
  // id.y = (id.y / 2.0 + BOARD_SIZE / size) * size;
  // id.z = (id.z / 2.0 + BOARD_SIZE / size) * size;
  return sampleSphere(repeatedRay, id, size);
}

float sdScene(vec3 ray) {
  return repeated(ray, 0.05 + abs(sin(uTime * 0.0001)) * 0.5);
}
