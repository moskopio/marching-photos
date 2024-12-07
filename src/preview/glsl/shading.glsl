#define SPECULAR_MAX   2000.0
#define SPECULAR_COLOR vec3(1.0)
#define SPECULAR_ALPHA 20.0

#define AMBIENT_COLOR vec3(0.1)
#define FRESNEL_COLOR vec3(1.0)
#define FRESNEL_ALPHA 0.5


vec3 calculateShading(in Scene scene) {
  vec3 normal = normalize(scene.normal);
  vec3 cameraPosition = normalize(scene.cameraPosition);
  vec3 lightPosition = normalize(scene.lightPosition);
  
  float toLightNormal = clamp(dot(lightPosition, normal), 0.0, 1.0);
  float viewAngleNormal = clamp(dot(cameraPosition, normal), 0.0, 1.0);

  float adjustedSpecularIntensity = max(1.0, SPECULAR_MAX - SPECULAR_ALPHA
);
  float diffuseShade = toLightNormal;
  float specularShade = pow(viewAngleNormal, adjustedSpecularIntensity);
  float fresnelShade = max(0.0, FRESNEL_ALPHA - viewAngleNormal);
  
  vec3 ambient = AMBIENT_COLOR;
  vec3 diffuse = scene.elementColor * diffuseShade;
  vec3 specular = SPECULAR_COLOR * diffuseShade * specularShade;
  vec3 fresnel = FRESNEL_COLOR * fresnelShade * (1.0 - diffuseShade);
  
  return ambient + diffuse + specular + fresnel;
}
