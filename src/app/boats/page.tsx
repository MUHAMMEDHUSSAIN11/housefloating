import getListings from "../actions/getListings";
import ClientOnly from "../components/ClientOnly";
import ListingCard from "../components/ListingCard/ListingCard";
import Container from "../components/Misc/Container"
import EmptyState from "../components/Misc/EmptyState";


export default async function Boat(){
    const listings = await getListings();
    
    if(listings == null){
      return (
        <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
      )
    }

    return(
      <ClientOnly>
        <Container>
          <div className="pb-20 pt-16">
        <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8">
         {listings.map((listing:any)=>{
          return(
            <ListingCard key={listing.id} data={listing}/>
          )
         })}
        </div>
        </div>
      </Container>
      </ClientOnly>
    )

}
