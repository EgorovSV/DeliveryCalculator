import { calculateDeliveryFee } from "../src/App";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { configure } from "@testing-library/react";

import App from "../src/App";
configure({ testIdAttribute: "data-test-id" });

describe("testing calculateDeliveryFee function", () => {
  it("free shipping for expensive order", () => {
    expect(
      calculateDeliveryFee(200, 0n, 0n, new Date(2017, 4, 4, 17, 23, 42, 11))
    ).toBe(0);
  });
  it("basic deliveryDistance", () => {
    expect(
      calculateDeliveryFee(15, 0n, 0n, new Date(2024, 0, 24, 14, 23, 42, 11))
    ).toBe(2);
  });
  it("2 extra euro for the deliveryDistance", () => {
    expect(
      calculateDeliveryFee(15, 1777n, 0n, new Date(2024, 0, 25, 19, 23, 42, 11))
    ).toBe(4);
  });
  it("low cart value additional fee", () => {
    expect(
      calculateDeliveryFee(6.7, 0n, 0n, new Date(2024, 0, 24, 14, 23, 42, 11))
    ).toBe(5.3);
  });

  it("additional 50 cent surcharge for each item above 4 in the order", () => {
    expect(
      calculateDeliveryFee(15, 770n, 6n, new Date(2024, 0, 25, 19, 23, 42, 11))
    ).toBe(3);
  });
  it('extra "bulk" fee for more than 12 items in the order', () => {
    expect(
      calculateDeliveryFee(15, 770n, 13n, new Date(2024, 0, 25, 19, 23, 42, 11))
    ).toBe(7.7);
  });
  it("maximum delivery fee", () => {
    expect(
      calculateDeliveryFee(
        15,
        7700n,
        130n,
        new Date(2024, 0, 25, 19, 23, 42, 11)
      )
    ).toBe(15);
  });
  it("Friday rush hour fee multiplication", () => {
    expect(
      calculateDeliveryFee(15, 1777n, 0n, new Date(2024, 0, 26, 15, 23, 42, 11))
    ).toBe(4.8);
  });
  it("Friday before rush hour, no fee multiplication", () => {
    expect(
      calculateDeliveryFee(15, 1777n, 0n, new Date(2024, 0, 26, 14, 59, 59, 59))
    ).toBe(4);
  });
  it("Friday after rush hour, no fee multiplication", () => {
    expect(
      calculateDeliveryFee(15, 1777n, 0n, new Date(2024, 0, 26, 19, 0, 0, 1))
    ).toBe(4);
  });
});

describe("basic interactivity tests", () => {
  it("input for cartValue", () => {
    render(<App />);
    expect(screen.getByTestId("cartValue")).toBeInTheDocument();
  });
  it("input for deliveryDistance", () => {
    render(<App />);
    expect(screen.getByTestId("deliveryDistance")).toBeInTheDocument();
  });
  it("input for numberOfItems", () => {
    render(<App />);
    expect(screen.getByTestId("numberOfItems")).toBeInTheDocument();
  });
  it("input for orderTime", () => {
    render(<App />);
    expect(screen.getByTestId("orderTime")).toBeInTheDocument();
  });

  it("button presence", () => {
    render(<App />);
    expect(screen.getByTestId("calculateFeeButton")).toBeInTheDocument();
  });
});

describe("warnings & incorrect input tests", () => {
  it("incorrect Cart value", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("cartValue"), {
      target: { value: 0 },
    });
    fireEvent.click(screen.getByTestId("calculateFeeButton"));
    expect(screen.getByTestId("warning").id).toBe("Cart value");
  });
  it("incorrect Delivery distance", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("deliveryDistance"), {
      target: { value: -5 },
    });
    fireEvent.click(screen.getByTestId("calculateFeeButton"));
    expect(screen.getByTestId("warning").id).toBe("Delivery distance");
  });
  it("incorrect Number of items", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("numberOfItems"), {
      target: { value: 0 },
    });
    fireEvent.click(screen.getByTestId("calculateFeeButton"));
    expect(screen.getByTestId("warning").id).toBe("Number of items");
  });
  it("incorrect Order time", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("orderTime"), {
      target: { value: null },
    });
    fireEvent.click(screen.getByTestId("calculateFeeButton"));
    expect(screen.getByTestId("warning").id).toBe("Order time");
  });
});

describe("testing app", () => {
  it("valid input test", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("cartValue"), {
      target: { value: "200" },
    });
    fireEvent.change(screen.getByTestId("deliveryDistance"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByTestId("numberOfItems"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("orderTime"), {
      target: { value: new Date(2024, 0, 25, 19, 23, 42, 11) },
    });
    fireEvent.click(screen.getByTestId("calculateFeeButton"));
    expect(parseInt(screen.getByTestId("fee").value)).toBe(0);
  });
});
