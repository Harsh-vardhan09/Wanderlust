
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
          container: 'map', // container ID
        //   style:"mapbox://styles/mapbox/street-v11",
          center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
          zoom: 8 // starting zoom
      });
      
    // console.log(coordinates);

const marker = new mapboxgl.Marker({color:'red'})
        .setLngLat(listing.geometry.coordinates) //listing.geomatery.coordinates 
        .setPopup(new mapboxgl.Popup({offset: 15})
        .setHTML(
            `<h5>${listing.title}</h5><p>Exact location provided after booking</p>`
        )
        .setMaxWidth("300px"))
        .addTo(map);

    