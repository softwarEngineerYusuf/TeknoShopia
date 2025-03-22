import { useState } from 'react';
import { Card, Row, Col, Button, Rate, Table, Image, Typography } from 'antd';
import { LeftOutlined, RightOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import './ProductDetail.css';

const { Title, Text } = Typography;

function ProductDetail() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/philips/thumb/145094-1-3_large.jpg',
    'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/philips/thumb/145094-3-3_large.jpg',
    'https://cdn.vatanbilgisayar.com/Upload/PRODUCT/philips/thumb/145094-1-3_large.jpg'
  ];

  const specifications = [
    { key: 'Ekran Boyutu', value: '50 inch' },
    { key: 'Çözünürlük (Piksel)', value: '3840 x 2160' },
    { key: 'Çözünürlük', value: '4K Ultra HD' },
    { key: 'Ekran Boyu (cm)', value: '139 cm' },
    { key: 'Yenileme Hızı', value: '60 Hz' }
  ];

  const columns = [
    {
      title: 'Özellik',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Değer',
      dataIndex: 'value',
      key: 'value',
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="container">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
        <div style={{ position: 'relative', width: '90%', margin: '0 auto' }}>
  <Button 
    icon={<LeftOutlined />} 
    style={{ 
      position: 'absolute',
      left: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      backgroundColor: 'rgba(255,255,255,0.8)'
    }}
    onClick={prevImage}
  />
  <Image
    src={images[currentImageIndex]}
    alt="LG TV"
    style={{ width: '100%', position: 'relative' }}
  />
  <Button 
    icon={<RightOutlined />} 
    style={{ 
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      backgroundColor: 'rgba(255,255,255,0.8)'
    }}
    onClick={nextImage}
  />
</div>
          <Row gutter={[8, 8]} style={{ marginTop: 16, width: '80%', margin: '0 auto' }}> 
            {images.map((img, index) => (
              <Col span={8} key={index}>
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  style={{ width: '100%', cursor: 'pointer' }}
                  onClick={() => setCurrentImageIndex(index)}
                />
              </Col>
            ))}
          </Row>
        </Col>
        
        <Col xs={24} md={12}>
          <Card>
            <Title level={2}>LG 50UQ75 50inc</Title>
            <Rate disabled defaultValue={4} />
            <Text> (Yorumlar)</Text>
            
            <div style={{ margin: '24px 0' }}>
              <Title level={3}>19.999TL</Title>
              <Text type="secondary">Karşılaştır</Text>
            </div>

            <Button 
              type="primary" 
              icon={<ShoppingCartOutlined />} 
              size="large"
              style={{ backgroundColor: '#32174D', width: '100%' }}
            >
              Sepete Ekle
            </Button>

            <div style={{ marginTop: 24 }}>
              <Title level={4}>Teknik Özellikler</Title>
              <Table 
                dataSource={specifications} 
                columns={columns} 
                pagination={false}
                size="small"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductDetail;