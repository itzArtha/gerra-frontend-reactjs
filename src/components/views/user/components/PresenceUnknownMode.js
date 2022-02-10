import MainButton from "../../../MainButton";

const PresenceUnknownMode = () => {
  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto text-center">
          <div>
            <div className="flex justify-center my-2">
              <img
                className="ml-12 w-1/2 object-cover"
                src={process.env.PUBLIC_URL + "/broken-heart.svg"}
                alt="Icon"
              />
            </div>
            <div className="my-4">
              <h2 className="font-semibold text-xl">
                Uwaaa, kamu gak terdaftar di event ini
              </h2>
            </div>
            <MainButton
              onClick={() => {
                window.location.href = "/";
              }}
              className="w-1/2 mt-4"
              label="Pulang yuk"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default PresenceUnknownMode;
