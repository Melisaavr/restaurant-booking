import { useEffect, useState } from "react";

import { Button, Field, Label, Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import Container from "../components/Container";
import Loader from "../components/Loader";
import Error from "../components/Error";

import { useNavigate } from "react-router-dom";
import useAuthStore from "../hooks/useAuthStore";
import useSWR, { mutate } from "swr";

import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";

const days = [
  { label: "Monday", value: "MON" },
  { label: "Tuesday", value: "TUE" },
  { label: "Wednesday", value: "WED" },
  { label: "Thursday", value: "THU" },
  { label: "Friday", value: "FRI" },
  { label: "Saturday", value: "SAT" },
  { label: "Sunday", value: "SUN" },
];

export default function BookSlot() {
  const [day, setDay] = useState(days[0].value);
  const { id, token, is_admin, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const [isBooking, setIsBooking] = useState(false);

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
      <Error
        message={`${slotsError?.message || ""} ${bookingsError?.message || ""}`}
      />
    );
  }

  const notify = () => toast.success("Booking successful!");

  const slotsByDay = slots.filter((s) => s.day === day);

  const sortedSlots = slotsByDay
    .sort((a, b) => a.id - b.id)
    .map((slot) => {
      const formattedStartTime = moment(slot.start_time, "HH:mm:ss").format(
        "h:mm A"
      );
      const formattedEndTime = moment(slot.end_time, "HH:mm:ss").format(
        "h:mm A"
      );

      return {
        ...slot,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
      };
    });

  function handleBooking(slot) {
    setIsBooking(true);
    axios
      .post(
        `https://restaurant-booking-sable-585091cb1330.herokuapp.com/api/bookings/`,
        { user: id, slot: slot.id },
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
        console.error(error);
      })
      .finally(() => {
        setIsBooking(false);
      });
  }

  return (
    <Container className="py-16">
      <div className="flex flex-col md:flex-row gap-5 justify-between">
        <div>
          <h2 className="font-bold text-2xl">Book your slot</h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            Showing you all the slots available in different time slots for that
            particular day.
          </p>
        </div>

        <Field className="">
          <Label className="font-semibold">Select Day</Label>
          <div className="relative">
            <Select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-72 sm:text-sm border-gray-300 rounded-md mt-1"
            >
              {days.map((state, index) => (
                <option key={index} value={state.value}>
                  {state.label}
                </option>
              ))}
            </Select>
            <ChevronDownIcon
              className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
              aria-hidden="true"
            />
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {sortedSlots.map((slot) => (
          <div
            key={slot.id}
            className="bg-gray-100 border border-gray-200 p-5 rounded-lg"
          >
            <h3>
              Timing:{" "}
              <span className="font-semibold">
                {slot.start_time} to {slot.end_time}
              </span>
            </h3>
            <p className="mt-2">
              Slots available:{" "}
              <span className="h-10 w-10 inline-flex items-center justify-center bg-gray-200 ml-2 rounded-full text-gray-800 font-semibold">
                {slot.seats}
              </span>
            </p>
            {bookings.map((b) => b.slot).includes(slot.id) ? (
              <div className="text-sm font-medium mt-4 text-green-600">
                ✅ You have already booked this lot.
              </div>
            ) : slot.seats === 0 ? (
              <div className="text-sm font-medium mt-4 text-red-600">
                ❌ All slots have already been booked.
              </div>
            ) : (
              <Button
                disabled={isBooking}
                onClick={() => handleBooking(slot)}
                className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isBooking ? (
                  <div className="inline-flex gap-3 items-center">
                    Booking <Loader h={5} w={5} />
                  </div>
                ) : (
                  "Book Now"
                )}
              </Button>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}
