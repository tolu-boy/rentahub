
import AddHotelForm from "@/components/hotel/addHotelForm";
import { getHotelById } from "../../../../actions/getHotelById";
import { auth, currentUser } from "@clerk/nextjs/server";


interface hotelPageProps{
    params:{
        hotelId:string 
    }
}

const HotelCreate = async({params}:hotelPageProps) => {
    console.log("hotelId", params.hotelId);
    const hotel = await getHotelById(params.hotelId) || null;

    const {userId} = auth()

    if(!userId ) return <div>not autenticated</div>
    // if(hotel?.userId !==userId) return <div>Acesss denied </div>
    return ( 
        <div>
        <AddHotelForm hotel={hotel}/>
        </div>
     );
}
 
export default HotelCreate;