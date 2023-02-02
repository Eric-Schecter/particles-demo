export class Texture {
  public id: WebGLTexture = 0;
  public location: WebGLUniformLocation = 0;
  constructor(private gl: WebGL2RenderingContext) { }
  private setupImage = (image: HTMLImageElement,internalFormat:number,format:number,type:number,wrapS:number, wrapT:number, minFilter:number, magFilter:number) => {
    this.id = this.gl.createTexture() as WebGLTexture;
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, wrapS);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, wrapT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, minFilter);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, magFilter);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, internalFormat,format, type, image);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
  }
  public load = (path: string,internalFormat=this.gl.RGBA,format=this.gl.RGBA,type=this.gl.UNSIGNED_BYTE,
    wrapS=this.gl.REPEAT, wrapT=this.gl.REPEAT, minFilter=this.gl.LINEAR, magFilter=this.gl.LINEAR) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = path;
        image.onload = ()=>{
          this.setupImage(image,internalFormat,format,type,wrapS, wrapT, minFilter, magFilter);
          resolve(true);
        }
    })
  }
}