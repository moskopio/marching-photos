#version 300 es
precision mediump float;

uniform float uTime;
uniform float uAspectRatio;
uniform vec2 uResolution;
uniform vec2 uTrack;
uniform vec2 uRotation;
uniform float uDolly;

uniform vec2 uSamples;
uniform float uPush;


uniform sampler2D uImage;
uniform float uImgAspectRatio;
