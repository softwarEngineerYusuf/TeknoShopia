import React, { useState } from 'react';
import './Brands.css'; // Add a CSS file for styling
import { Pagination } from 'antd';

const brandLogos = [
  { src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', alt: 'Apple' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', alt: 'Samsung' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', alt: 'Philips' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', alt: 'Microsoft' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', alt: 'Asus' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', alt: 'Lenovo' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', alt: 'Xiaomi' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', alt: 'LG' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', alt: 'MSI' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', alt: 'Huawei' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', alt: 'Huawei' }
];

const itemsPerPage = 8;

function Brands() {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBrands = brandLogos.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="brands-container container">
      <h2 className="brands-title">Brands</h2>
      <div className="brands-logos">
        {currentBrands.map((brand, index) => (
          <div key={index} className="brand-logo">
            <img src={brand.src} alt={brand.alt} />
          </div>
        ))}
      </div>
      <div className='pagination-container d-flex justify-content-center mt-4'>
      <Pagination
        current={currentPage}
        total={brandLogos.length}
        pageSize={itemsPerPage}
        onChange={handlePageChange}
      />
      </div>
    </div>
  );
}

export default Brands;
