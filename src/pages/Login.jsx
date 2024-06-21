import { useEffect, useState } from "react";
import { Input, Button, Field, Label } from "@headlessui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Container from "../components/Container";
import Loader from "../components/Loader";

import useAuthStore from "../hooks/useAuthStore";
import { toSentenceCase } from "../utils";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const notify = () => toast.success("Logged in successfully!");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { setUser, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    axios
      .post(
        `https://restaurant-booking-sable-585091cb1330.herokuapp.com/api/users/login/`,
        formData
      )
      .then((response) => {
        const { is_admin, user, token } = response.data;
        const userObj = { is_admin, token, ...user };
        setUser(userObj);
        notify();
        navigate("/");
        localStorage.setItem("user", JSON.stringify(userObj));
      })
      .catch((error) => {
        if (error.response) {
          setError(toSentenceCase(error.response.data.error));
        } else {
          setError(toSentenceCase(error.message));
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  return (
    <Container className="py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-center font-bold text-2xl">
          Login to your account
        </h1>

        <form className="mt-10 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field>
            <Label className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mt-2"
              name="email"
              type="email"
              placeholder="itspeterparker@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={26}
            />
          </Field>

          <Field>
            <Label className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              type="password"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mt-2"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={16}
            />
          </Field>

          <div className="mt-5 text-center">
            <Button
              disabled={isSubmitting}
              className="inline-flex items-center w-full justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
            >
              {isSubmitting ? (
                <div className="inline-flex gap-3 items-center">
                  Submitting <Loader h={5} w={5} />
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>

        {error && (
          <div className="text-red-600 text-center mt-6 p-2 bg-red-100 rounded-sm ring-1 ring-red-300">
            {error}
          </div>
        )}
      </div>
    </Container>
  );
}
