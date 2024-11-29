vec3 calculateLambertShading(in ShadingCommon common, in Light light) {
  vec3 normal = normalize(common.normal);
  vec3 cameraPosition = normalize(common.origin);
  vec3 lightPosition = normalize(light.position);
  
  float toLightNormal = clamp(dot(lightPosition, normal), 0.0, 1.0);
  float viewAngleNormal = clamp(dot(cameraPosition, normal), 0.0, 1.0);

  float adjustedSpecularIntensity = max(1.0, SPECULAR_MAX - light.alpha);
  float diffuseShade = toLightNormal;
  float specularShade = pow(viewAngleNormal, adjustedSpecularIntensity);
  float fresnelShade = max(0.0, 0.5 - viewAngleNormal);
  
  vec3 ambient = light.ambient;
  vec3 diffuse = light.diffuse * diffuseShade;
  vec3 specular = light.specular * diffuseShade * specularShade;
  vec3 fresnel = light.fresnel * fresnelShade * (1.0 - diffuseShade);
  
  return ambient + diffuse + specular + fresnel;
}
