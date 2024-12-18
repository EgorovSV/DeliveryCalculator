import { useState } from "react";
import { forwardRef } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import Alert from "react-bootstrap/Alert";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

export function calculateDeliveryFee(
  cartValue: number,
  deliveryDistance: bigint,
  numberOfItems: bigint,
  orderTime: Date
): number {
  if (cartValue >= 200) return 0;
  var deliveryFee = 2;
  if (deliveryDistance > 1000)
    deliveryFee += Math.ceil((Number(deliveryDistance) - 1000) / 500);
  if (cartValue < 10) deliveryFee += 10 - cartValue;
  if (numberOfItems > 4) deliveryFee += (Number(numberOfItems) - 4) * 0.5;
  if (numberOfItems > 12) deliveryFee += 1.2;
  if (
    orderTime.getDay() == 5 &&
    orderTime.getHours() >= 15 &&
    orderTime.getHours() < 19
  )
    deliveryFee *= 1.2;
  if (deliveryFee > 15) return 15;
  return deliveryFee;
}

function App() {
  const [cartValue, setCartValue] = useState(5);
  const [deliveryDistance, setDeliveryDistance] = useState(555);
  const [numberOfItems, setNumberOfItems] = useState(3);
  const [orderTime, setOrderTime] = useState(new Date());
  const [fee, setFee] = useState(-3);
  const [warning, setWarning] = useState("");

  function checkInputAndCalculate(
    cartValue: number,
    deliveryDistance: number,
    numberOfItems: number,
    orderTime: Date
  ) {
    setFee(-1);
    if (Number.isNaN(cartValue) || cartValue <= 0) {
      setWarning("Cart value");
      return;
    }
    if (
      Number.isNaN(deliveryDistance) ||
      deliveryDistance <= 0 ||
      deliveryDistance % 1 > 0
    ) {
      setWarning("Delivery distance");
      return;
    }
    if (
      Number.isNaN(numberOfItems) ||
      numberOfItems <= 0 ||
      numberOfItems % 1 > 0
    ) {
      setWarning("Number of items");
      return;
    }
    if (orderTime == null) {
      setWarning("Order time");
      return;
    }
    setWarning("");
    setFee(
      calculateDeliveryFee(
        cartValue,
        BigInt(deliveryDistance),
        BigInt(numberOfItems),
        orderTime
      )
    );
  }

  const DatePickerCustomInput = forwardRef(
    ({ value, onClick, onChange }, ref) => (
      <Form.Control
        className="example-custom-input"
        onClick={onClick}
        ref={ref}
        onChange={onChange}
        value={value}
        data-test-id="orderTime"
      />
    )
  );

  return (
    <div className="App">
      <h2>Delivery fee calculator</h2>
      <InputGroup className="mb-3">
        <InputGroup.Text className="group name">Cart value</InputGroup.Text>
        <Form.Control
          type="number"
          value={!Number.isNaN(cartValue) ? cartValue : ""}
          placeholder="Cart value"
          onChange={(e) => setCartValue(parseFloat(e.target.value))}
          data-test-id="cartValue"
        />
        <InputGroup.Text>{"\u20AC"}</InputGroup.Text>
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Delivery distance</InputGroup.Text>
        <Form.Control
          type="number"
          value={!Number.isNaN(deliveryDistance) ? deliveryDistance : ""}
          placeholder="Delivery distance"
          onChange={(e) => setDeliveryDistance(parseInt(e.target.value))}
          data-test-id="deliveryDistance"
        />
        <InputGroup.Text>m</InputGroup.Text>
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Number of items</InputGroup.Text>
        <Form.Control
          className="control"
          type="number"
          value={!Number.isNaN(numberOfItems) ? numberOfItems : ""}
          placeholder="Number of items"
          onChange={(e) => setNumberOfItems(parseInt(e.target.value))}
          data-test-id="numberOfItems"
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Order time</InputGroup.Text>
        <DatePicker
          selected={orderTime}
          onChange={(date) => setOrderTime(date)}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          customInput={<DatePickerCustomInput />}
        />
      </InputGroup>
      <button
        onClick={() =>
          checkInputAndCalculate(
            cartValue,
            deliveryDistance,
            numberOfItems,
            orderTime
          )
        }
        data-test-id="calculateFeeButton"
      >
        Calculate delivery fee
      </button>
      {fee >= 0 && (
        <InputGroup className="mb-3">
          <InputGroup.Text className="group name">Delivery fee</InputGroup.Text>
          <Form.Control
            className="control"
            value={!Number.isNaN(fee) ? fee : ""}
            placeholder="fee"
            data-test-id="fee"
            readOnly
          />
        </InputGroup>
      )}
      {warning.length > 1 && (
        <Alert id={warning} variant="warning" data-test-id="warning">
          {warning} is incorrect, please fix it
        </Alert>
      )}
    </div>
  );
}

export default App;
