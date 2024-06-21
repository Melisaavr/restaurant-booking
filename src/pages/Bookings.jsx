import { Button } from "@headlessui/react";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../hooks/useAuthStore";
import Loader from "../components/Loader";
import Error from "../components/Error";
import useSWR, { mutate } from "swr";
import { convertTimeFormat, getFullDayName } from "../utils";
import axios from "axios";
import toast from "react-hot-toast";

export default function Bookings() {
  const { token, is_admin, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!isLoading && (!token || is_admin)) {
      navigate("/login");
    }
  }, [token, navigate, is_admin, isLoading]);

  const fetcher = (url) =>
    fetch(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    }).then((res) => res.json());

  const {
    data: slots = [],
    error: slotsError,
    isLoading: slotsLoading,
  } = useSWR(
    token
      ? "https://restaurant-booking-sable-585091cb1330.herokuapp.com/api/slots/"
      : null,
    fetcher,
    {
      revalidateOnMount: true,
    }
  );

  const {
    data: bookings = [],
    error: bookingsError,
    isLoading: bookingsLoading,
  } = useSWR(
    token
      ? "https://restaurant-booking-sable-585091cb1330.herokuapp.com/api/bookings/"
      : null,
    fetcher,
    {
      revalidateOnMount: true,
    }
  );

  if (isLoading || slotsLoading || bookingsLoading) {
    return (
      <div className="flex justify-center mt-16">
        <Loader />
      </div>
    );
  }

  if (slotsError || bookingsError) {
    return (
      <div className="flex justify-center  mt-16">
        <Error
          message={`${slotsError?.message || ""} ${
            bookingsError?.message || ""
          }`}
        />
      </div>
    );
  }

  const notify = () => toast.success("Cancellation successful!");
  const notifyError = () =>
    toast.error(
      "An error occured while cancelling your slot. Please try again."
    );

  function handleCancelling(booking) {
    setIsCancelling(true);
    axios
      .delete(
        `https://restaurant-booking-sable-585091cb1330.herokuapp.com/api/bookings/${booking.id}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      )
      .then(() => {
        notify();
        mutate(
          "https://restaurant-booking-sable-585091cb1330.herokuapp.com/api/bookings/"
        );
        mutate(
          "https://restaurant-booking-sable-585091cb1330.herokuapp.com/api/slots/"
        );
      })
      .catch((error) => {
        notifyError();
        console.error(error);
      })
      .finally(() => {
        setIsCancelling(false);
      });
  }

  return (
    <Container className="py-16">
      <h2 className="font-bold text-2xl">Your Bookings</h2>
      <p className="text-gray-600 mt-2 leading-relaxed">
        Showing you the list of all your active bookings.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {bookings.length === 0 && <p>No Bookings to show.</p>}
        {bookings.map((mb) => (
          <div
            key={mb.id}
            className="bg-gray-100 p-6 rounded-lg flex flex-col sm:flex-row md:items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">
                Day: {getFullDayName(slots.find((s) => s.id === mb.slot).day)}
              </h3>
              <p className="mt-1">
                Time Slot:{" "}
                {convertTimeFormat(
                  slots.find((s) => s.id === mb.slot).start_time
                )}{" "}
                to{" "}
                {convertTimeFormat(
                  slots.find((s) => s.id === mb.slot).end_time
                )}
              </p>
            </div>
            <Button
              disabled={isCancelling}
              onClick={() => handleCancelling(mb)}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCancelling ? (
                <div className="inline-flex gap-3 items-center">
                  Cancelling <Loader h={5} w={5} />
                </div>
              ) : (
                "Cancel Booking"
              )}
            </Button>
          </div>
        ))}
      </div>
    </Container>
  );
}
