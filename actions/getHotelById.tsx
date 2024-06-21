import { NextResponse } from "next/server"
import prismadb from "../lib/prismadb"

export const getHotelById = async(hotelId: string)=>{
    try {
        const hotel = await prismadb.hotel.findUnique({
            where:{
                id:hotelId
            },
            include : {
                rooms:true
            }

        })

        if(!hotel) return null

        return hotel

    } catch (error:any) {
        // throw new Error(error)
        console.log(error);
        // return new NextResponse('Internal Server Error',{status:500})

        
    }
}