import { Fragment, useEffect } from "react";
import Container from "../components/Container";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../hooks/useAuthStore";
import Error from "../components/Error";
import Loader from "../components/Loader";
import useSWR from "swr";
import moment from "moment";
import { convertTimeFormat, getFullDayName } from "../utils";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ManageSlots() {
  const { token, is_admin, isLoading } = useAuthStore();
  const navigate = useNavigate();

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

  if (isLoading || slotsLoading) {
    return (
      <div className="flex justify-center mt-16">
        <Loader />
      </div>
    );
  }

  if (slotsError) {
    return <Error message={`${slotsError?.message || ""}`} />;
  }

  const sortedSlots = slots
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

  const finalArray = Object.entries(
    sortedSlots.reduce((acc, curr) => {
      const { day, ...rest } = curr;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(rest);
      return acc;
    }, {})
  ).map(([day, slots]) => ({ day: getFullDayName(day), slots }));

  return (
    <Container className="py-16">
      <h2 className="font-bold text-2xl">Manage Slots</h2>
      <p className="text-gray-600 mt-2 leading-relaxed">
        Showing you the list of all slots currently active.
      </p>

      <div className="px-4 md:px-0">
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-white">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Time Slot
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Total Slots
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Slots Booked
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Remaining Slots
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {finalArray.map((detail) => (
                      <Fragment key={detail.day}>
                        <tr className="border-t border-gray-200">
                          <th
                            colSpan={5}
                            scope="colgroup"
                            className="bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-gray-900 sm:px-6"
                          >
                            {detail.day}
                          </th>
                        </tr>
                        {detail.slots.map((slot, slotIdx) => (
                          <tr
                            key={slot.id}
                            className={classNames(
                              slotIdx === 0
                                ? "border-gray-400"
                                : "border-gray-300",
                              "border-t"
                            )}
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {convertTimeFormat(slot.start_time)} to{" "}
                              {convertTimeFormat(slot.end_time)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 pl-10 text-sm text-gray-600 font-medium bg-indigo-100">
                              5
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 pl-10 text-sm text-gray-600 font-medium bg-green-100">
                              {5 - slot.seats}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 pl-10 text-sm text-gray-600 font-medium bg-red-100">
                              {slot.seats}
                            </td>
                          </tr>
                        ))}
                      </Fragment>
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
