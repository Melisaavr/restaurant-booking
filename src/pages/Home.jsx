import { Link } from "react-router-dom";

import Container from "../components/Container";
import useAuthStore from "../hooks/useAuthStore";

export default function Home() {
  const { full_name, token, is_admin } = useAuthStore();

  return (
    <Container className="py-12 grid grid-cols-1 md:grid-cols-7 gap-12">
      <div className="md:my-24 md:col-span-3">
        {full_name && (
          <span className="mb-4 block font-medium text-lg">
            Welcome, {full_name}
          </span>
        )}
        <h2 className="font-bold text-3xl">
          At Prime Time Grill, Your Reservation is Our Pleasure
        </h2>
        <p className="text-gray-600 mt-4 leading-relaxed">
          Prime Time Grill invites you to indulge in a culinary journey where
          every bite is a masterpiece. From succulent steaks and fresh seafood
          to innovative grilled creations, our menu offers a symphony of flavors
          to satisfy every palate. Reserve your table in advance and discover a
          dining experience where impeccable service and a vibrant atmosphere
          meet.
        </p>

        {token ? (
          is_admin ? (
            <Link
              to="all-bookings"
              className="mt-8 inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              See All Bookings
            </Link>
          ) : (
            <Link
              to="book-slot"
              className="mt-8 inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Book Slot Now
            </Link>
          )
        ) : (
          <Link
            to="login"
            className="mt-8 inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Login Now To Book Slot
          </Link>
        )}
      </div>

      <div className="w-full md:col-span-4 grid grid-cols-2 gap-4">
        <div className="overflow-hidden rounded-lg">
          <img
            src="https://images.pexels.com/photos/10480245/pexels-photo-10480245.jpeg"
            alt="Image of a salad plate"
            className="hover:scale-105 transition"
          />
        </div>
        <div className="overflow-hidden rounded-lg">
          <img
            src="https://images.pexels.com/photos/15801075/pexels-photo-15801075/free-photo-of-bartender-making-a-cappuccino.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Image of a coffee"
            className="hover:scale-105 transition"
          />
        </div>
        <div className="overflow-hidden rounded-lg">
          <img
            src="https://images.pexels.com/photos/7170952/pexels-photo-7170952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Image of delicious Breads"
            className="hover:scale-105 transition"
          />
        </div>
        <div className="overflow-hidden rounded-lg">
          <img
            src="https://images.pexels.com/photos/4871111/pexels-photo-4871111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Image of a salad plate containing tomatoes"
            className="hover:scale-105 transition"
          />
        </div>
      </div>
    </Container>
  );
}
