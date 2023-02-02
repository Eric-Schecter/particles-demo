#version 300 es

precision mediump float;

uniform vec2 u_resolution;

out vec4 fColor;

void main(){  
  vec2 uv = gl_PointCoord.xy;
  vec2 color = gl_FragCoord.xy/u_resolution;
  if(length(uv - vec2(0.5))>.5){
    discard;
  }
  fColor=vec4(color,1.,1.);
}
