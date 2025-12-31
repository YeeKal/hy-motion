
export enum ToolType {
    ImageGeneration,
    EditImage,
    RemoveBackground
}



export enum ModelType {
  TextToImage,
  TIToImage, // text required, image optional
  TIIToImage, // text required, image required
  ImageToImage, // no text general image is meaningless
  BackgroundRemover,
  LabubuLora,
  KontextLora, // for lora model
  FluxLora, // for flux lora model
  ImageToVideo, // image required
}

  export enum ParamRequirement {
    Required = "required",
    Optional = "optional",
    Disabled = "disabled", // e.g., for a purely text-to-image generator or informational model page
  }

export type Model={
    id:string
    apiId: string
    type: ModelType
    name:string
    description:string
    providerId: string
    price:number
    credits:number
    isAvailable:boolean
    supportImageArray:boolean
    inputs: {
    text: ParamRequirement,  
    image: ParamRequirement,
    imageMaxNum: number; // the max image numbers supported
  },
    //  composer will check the compatibility with prompt and image as the order
    composer?:{
      type: ModelType
      apiId: string
      providerId: string
      credits: number
      price: number
    }[]
}