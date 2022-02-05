import { useEffect, useState } from "react";
import FinishPayment from "./components/FinishPayment";
import Pay from "./components/Pay";
import PaymentMethod from "./components/PaymentMethod";
import useQuery from "../../useQuery";
const Payment = () => {
  const query = useQuery();
  return (
    <>
      <div className=" mt-24">
        {query.get("status") === "success" ? (
          <FinishPayment />
        ) : query.get("ref_id") ? (
          <Pay />
        ) : (
          <PaymentMethod />
        )}
        <div className="flex justify-center mt-24">
          <img
            className="w-32"
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="Logo"
          />
        </div>
      </div>
    </>
  );
};
export default Payment;
