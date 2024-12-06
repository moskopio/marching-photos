#version 300 es
precision mediump float;

in vec2 vPos;
out vec4 outColor;

uniform float uTime;
uniform float uAspectRatio;
uniform vec2 uResolution;
uniform vec2 uRotation;
uniform float uDolly;

uniform vec2 uSamples;
uniform float uPush;

uniform sampler2D uImage;
uniform float uImgAspectRatio;


struct Scene {
  vec3 cameraPosition;
  vec3 lightPosition;
  vec3 normal;
  vec3 elementColor;
};
