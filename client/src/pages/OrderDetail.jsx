import React from 'react'
import { useParams } from 'react-router-dom'

export const OrderDetail = () => {
    const { orderId } = useParams();

  return (
    <div>OrderDetail {}</div>
  )
}
