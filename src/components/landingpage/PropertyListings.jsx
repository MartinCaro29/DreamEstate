import React from 'react';
import { Eye, Circle } from 'lucide-react';
import {Button} from 'react-bootstrap'
import LuanB from '../../images/luanb.jpg'
import InaS from '../../images/inas.jpg'
import AltinR from '../../images/altinr.jpg'

const PropertyListings = () => {
  const listings = [
    {
      id: 1,
      title: "Apartament te ringside, prane bulevardit",
      views: 1244,
      price: 250000,
      imageUrl: LuanB
    },
    {
      id: 2,
      title: "Vile ekskluzive prane liqenit te Farkes",
      views: 1244,
      price: 250000,
      imageUrl: InaS
    },
    {
      id: 3,
      title: "Apartament 2+1+Parking te White Tower, Komuna e Parisit!",
      views: 1244,
      price: 250000,
      imageUrl: AltinR
    }
  ];

  return (
    <div className="container py-4">
      <div className="row g-4">
        {listings.map((listing) => (
          <div key={listing.id} className="col-md-4 col-sm-12">
            <div className="card h-100">
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column justify-content-between" style={{textAlign:'left'}}>
               <div>
                  <small className='text-secondary mb-2' style={{fontSize:'0.75rem'}}>Apartament per 1 person</small> 
               
                
                <h4 className="card-title mt-1 fs-6 mb-3" style={{color:'#00114b'}}>
                  {listing.title}
                </h4>

                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center text-secondary" >
                    <Eye size={30} className="me-1" style={{color:'#00114b'}} />
                    <small style={{color:'#00114b'}}>{listing.views}</small>
                  </div>
                  <span className="h4 fw-bold" style={{color:'#face00', margin:0}}>
                    ${listing.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-5 border-0 bg-light">
        <div className="card-body text-center py-4 d-flex flex-wrap justify-content-between">
          <div className="d-flex flex-column" style={{textAlign:'left'}}>
          <h2 className="fw-bold mb-0 h3" style={{color:'#00114b'}}>
            Kerkoni per prona?
          </h2>
          <p className=" mb-2" style={{color:'#00114b'}}>Jeni ne vendin e duhur!</p>
          </div>
          <Button className="mt-auto mb-auto" style={{backgroundColor:'#face00', color:'#00114b', width:'5rem', height:'2.5rem'}}>Gjej</Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyListings;