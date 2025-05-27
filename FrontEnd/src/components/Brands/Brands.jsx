import React from 'react';
import './Brands.css';
import { useNavigate } from 'react-router-dom';

const Brands = () => {
  const navigate = useNavigate(); 
  const brands = [
    { id: 1, name: 'TCL', logoUrl: 'https://cdn.vatanbilgisayar.com/Upload/GENERAL/ter-ed-marka/tcl-logo.png' },
    { id: 2, name: 'Samsung', logoUrl: 'https://cdn.vatanbilgisayar.com/Upload/GENERAL/ter-ed-marka/samsung.png' },
    { id: 3, name: 'Sony', logoUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&auto=format&fit=crop' },
    { id: 4, name: 'Microsoft', logoUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=300&auto=format&fit=crop' },
    { id: 5, name: 'LG', logoUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&auto=format&fit=crop' },
    { id: 6, name: 'Dell', logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&auto=format&fit=crop' },
    { id: 7, name: 'HP', logoUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&auto=format&fit=crop' },
    { id: 8, name: 'Lenovo', logoUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=300&auto=format&fit=crop' },
  ];

  // Duplicate the brands array to create infinite scrolling effect
  const duplicatedBrands = [...brands, ...brands];

  return (
    <div className="brand-carousel-container">
      <h2 className="brand-carousel-title">Brands</h2>
      <div className="brand-carousel-track">
        {duplicatedBrands.map((brand, index) => (
          <div className="brand-carousel-item" key={`${brand.id}-${index}`}>
            <img 
              src={brand.logoUrl} 
              alt={`${brand.name} logo`} 
              className="brand-logo"
              title={brand.name}
              style={{cursor:'pointer'}}
              onClick={() => navigate('/brands')} // Yönlendirme burada
            />
            <h1 style={{display:'flex',alignItems:'center',justifyContent:'center',marginTop:'0.5rem'}}>{brand.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
