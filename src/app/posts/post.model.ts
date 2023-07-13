export interface post  {
    id:string | null
    title:string,
    content:string
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