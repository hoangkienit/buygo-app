import React from 'react'
import { useParams } from 'react-router-dom';
import './admin-product-detail.css'

export const AdminProductDetail = () => {
    const { productId } = useParams();
  return (
      <div className='admin-product-detail-container'>
          AdminProductDetail {productId}
      </div>
  )
}
