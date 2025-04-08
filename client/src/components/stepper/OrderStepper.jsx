import React from 'react'
import { Step, Stepper } from 'react-form-stepper'
import './order-stepper.css'
import { statusText } from '../../utils'

export const OrderStepper = ({currentStep, order_status}) => {
  return (
    <Stepper className='stepper' activeStep={currentStep} styleConfig={{
              activeBgColor: "transparent",
              activeBgColor: "#134977",
              activeTextColor: "#fff",
              inactiveBgColor: "#e0e0e0",
              inactiveTextColor: "#000",
              completedBgColor: "#134977",
              completedTextColor: "#fff"
              }}>
              <Step label="Đặt hàng" />
            <Step label="Đang xử lí" />
          <Step label={order_status === 'processing' ? "" : `${statusText(order_status)}`} />
            </Stepper>
  )
}
