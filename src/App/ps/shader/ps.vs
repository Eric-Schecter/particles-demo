#version 300 es

layout(location=0)in vec3 a_position;

out vec3 v_position;

void main(){
  gl_Position=vec4(a_position,1.f);
  v_position = a_position;
  gl_PointSize = 4.;
}
