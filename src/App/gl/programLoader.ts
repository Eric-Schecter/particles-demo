import { throwErrorIfInvalid } from "./utils";

export class ProgramLoader {
  private addLineNumbers = (source: string) => {
    const lines = source.split('\n');
    for (let i = 0; i < lines.length; i++) {
      lines[i] = (i + 1) + ': ' + lines[i];
    }
    return lines.join('\n');
  }
  private createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
    const shader = throwErrorIfInvalid(gl.createShader(type));
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(shader))
      console.log(this.addLineNumbers(source));
      throw new Error('compile shader fail');
    }
    return shader;
  }
  public load = (gl: WebGL2RenderingContext, vs: string, fs: string,varyings:string[] = []) => {
    const program = throwErrorIfInvalid(gl.createProgram());
  
    const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fs);
  
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    if(varyings.length){
      gl.transformFeedbackVaryings(program,varyings,gl.SEPARATE_ATTRIBS);
    }
  
    gl.linkProgram(program);
  
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw Error(`Could not compile WebGL program. \n\n${info}`);
    }
  
    // gl.detachShader(program,vertexShader);
    // gl.detachShader(program,fragmentShader);
    // gl.deleteShader(vertexShader);
    // gl.deleteShader(fragmentShader);
  
    return program;
  }
}