import { useState } from "react";
import Input from "../../../../MainInput";
import Label from "../../../../Label";
import ErrorLabel from "../../../../ErrorLabel";
import MainButton from "../../../../MainButton";
import Skeleton from "../../../../Skeleton";
import apiClient from "../../../../services/apiClient";

const Security = () => {
  const [isLoading, setLoading] = useState(false);
  const [formData, setformData] = useState({
    password: "",
    isPasswordError: false,
    passwordErrorLabel: "",
    password_confirmation: "",
    isPasswordConfirmationError: false,
    passwordConfirmationErrorLabel: "",
  });

  const hanldeUpdate = async () => {
    setLoading(true);
    await apiClient
      .post("/api/v1/manual/password/reset", {
        password: formData.password,
      })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setformData({
            ...formData,
            isPasswordError: true,
            passwordErrorLabel: error.response.data.message,
          });
        } else {
          // setShowModal(true);
        }
        setLoading(false);
        setformData({
          password: "",
          password_confirmation: "",
        });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.password &&
      formData.password_confirmation &&
      formData.password === formData.password_confirmation
    ) {
      setformData({
        ...formData,
        isPasswordError: false,
      });
      setLoading(true);
      await hanldeUpdate();
    } else if (!formData.password) {
      setformData({
        ...formData,
        isPasswordError: true,
        passwordErrorLabel: "Password gak boleh kosong, anj",
      });
    } else if (!formData.password_confirmation) {
      setformData({
        ...formData,
        isPasswordConfirmationError: true,
        passwordConfirmationErrorLabel: "Dibilangin ga boleh kosong!",
      });
    } else if (formData.password_confirmation !== formData.password) {
      setformData({
        ...formData,
        isPasswordConfirmationError: true,
        passwordConfirmationErrorLabel: "Gak sama itu gan, benerin nae!",
      });
    }
  };
  return (
    <>
      <div className="m-4">
        <div
          className="bg-green-100 rounded-b text-green-600 px-4 py-3 shadow-md"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Ya aku ngingetin aja si</p>
              <p className="text-sm">
                Jangan lupa ganti password secara berkala siapa tau passwordmu
                diketahuin orang lain kan
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <form onSubmit={handleSubmit}>
            <div className="mt-4 w-full md:w-1/2 mx-auto">
              {isLoading ? (
                <Skeleton className="w-28 h-2 rounded" count={1} />
              ) : (
                <Label label="Password" />
              )}
              {isLoading ? (
                <Skeleton className="w-full h-10 rounded" count={1} />
              ) : (
                <Input
                  value={formData.password}
                  onChange={(e) =>
                    setformData({
                      ...formData,
                      password: e.target.value,
                      isPasswordError: false,
                    })
                  }
                  name="password"
                  type="password"
                />
              )}
              {formData.isPasswordError ? (
                <ErrorLabel label={formData.passwordErrorLabel} />
              ) : (
                ""
              )}
            </div>
            <div className="mt-4 w-full md:w-1/2 mx-auto">
              {isLoading ? (
                <Skeleton className="w-28 h-2 rounded" count={1} />
              ) : (
                <Label label="Konfirmasi Password" />
              )}
              {isLoading ? (
                <Skeleton className="w-full h-10 rounded" count={1} />
              ) : (
                <Input
                  value={formData.password_confirmation}
                  onChange={(e) =>
                    setformData({
                      ...formData,
                      password_confirmation: e.target.value,
                      isPasswordConfirmationError: false,
                    })
                  }
                  name="konfirmasi_password"
                  type="password"
                />
              )}
              {formData.isPasswordConfirmationError ? (
                <ErrorLabel label={formData.passwordConfirmationErrorLabel} />
              ) : (
                ""
              )}
            </div>
            <div className="mt-8 w-full md:w-1/2 mx-auto">
              <MainButton
                className="w-full"
                type="submit"
                disabled={isLoading}
                label={isLoading ? "Menyimpan..." : "Simpan"}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Security;
