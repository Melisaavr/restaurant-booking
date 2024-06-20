import { Button } from "@headlessui/react";
import Container from "../components/Container";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../hooks/useAuthStore";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { convertTimeFormat, getFullDayName } from "../utils";
import axios from "axios";
import toast from "react-hot-toast";

export default function AllBookings() {
  const { token, is_admin, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!isLoading && (!token || !is_admin)) {
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
  } = useSWR(token ? "http://127.0.0.1:8000/api/slots/" : null, fetcher, {
    revalidateOnMount: true,
  });

  const {
    data: bookings = [],
    error: bookingsError,
    isLoading: bookingsLoading,
  } = useSWR(token ? "http://127.0.0.1:8000/api/bookings/" : null, fetcher, {
    revalidateOnMount: true,
  });

  const {
    data: users = [],
    error: usersError,
    isLoading: usersLoading,
  } = useSWR(token ? "http://127.0.0.1:8000/api/users/" : null, fetcher, {
    revalidateOnMount: true,
  });

  if (isLoading || slotsLoading || bookingsLoading || usersLoading) {
    return (
      <div className="flex justify-center mt-16">
        <Loader />
      </div>
    );
  }

  if (slotsError || bookingsError || usersError) {
    return (
      <Error
        message={`${slotsError?.message || ""} ${
          bookingsError?.message || ""
        } ${usersError?.message || ""}`}
      />
    );
  }

  const notify = () => toast.success("Cancellation successful!");

  function handleCancelling(booking) {
    setIsCancelling(true);
    axios
      .delete(`http://127.0.0.1:8000/api/bookings/${booking.id}`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => {
        notify();
        mutate("http://127.0.0.1:8000/api/bookings/");
        mutate("http://127.0.0.1:8000/api/slots/");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsCancelling(false);
      });
  }

  return (
    <Container className="py-16">
      <h2 className="font-bold text-2xl">All Bookings</h2>
      <p className="text-gray-600 mt-2 leading-relaxed">
        Showing you the list of all active bookings and there details.
      </p>

      <div className="px-4 md:px-0">
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Day
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Time Slot
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Booked By
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        User&apos;s Email
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Action</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {getFullDayName(
                            slots.find((s) => s.id === booking.slot).day
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {convertTimeFormat(
                            slots.find((s) => s.id === booking.slot).start_time
                          )}{" "}
                          to{" "}
                          {convertTimeFormat(
                            slots.find((s) => s.id === booking.slot).end_time
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {users.find((u) => u.id === booking.user).full_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {users.find((u) => u.id === booking.user).email}
                        </td>
                        <td className="relative whitespace-nowrap py-3 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Button
                            disabled={isCancelling}
                            onClick={() => handleCancelling(booking)}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isCancelling ? (
                              <div className="inline-flex gap-3 items-center">
                                Cancelling <Loader h={5} w={5} />
                              </div>
                            ) : (
                              "Cancel Booking"
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
