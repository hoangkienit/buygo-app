import React from 'react'
import { useParams } from 'react-router-dom'

export const AdminOrderDetail = () => {
    const { orderId } = useParams();
  return (
      <div>AdminOrderDetail {orderId }</div>
  )
}
