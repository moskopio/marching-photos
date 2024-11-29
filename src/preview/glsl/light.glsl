#define SPECULAR_MAX 2000.0

struct Light {
  vec3  position;
  vec3  ambient;
  vec3  diffuse;
  vec3  specular;
  vec3  fresnel;
  float alpha;
};

struct ShadingCommon {
  vec3 point;
  vec3 normal;
  vec3 origin;
};
