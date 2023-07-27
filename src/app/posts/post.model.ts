export interface post  {
    [x: string]: any
    id:string | null
    title:string,
    content:string,
    imagePath:string
   }

export interface responseData {
    message:string,
    data:{
    id:string | null
    title:string,
    content:string
    },
    status:number
}   